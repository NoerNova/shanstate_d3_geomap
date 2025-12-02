"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { MapMeta, TopoJsonData, TownshipProperties } from "@/types";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";

interface ChoroplethMapProps {
  mapMeta: MapMeta;
  onSelectTownship: (props: TownshipProperties | null) => void;
}

const propertyFieldMap: Record<string, string> = {
  township: "TS",
  district: "DT",
  state: "ST",
};

type TooltipState = {
  name: string;
  district?: string;
  state?: string;
  x: number;
  y: number;
};

const ChoroplethMap: React.FC<ChoroplethMapProps> = ({
  mapMeta,
  onSelectTownship,
}) => {
  const choroplethMap = useRef<SVGSVGElement>(null);
  const [svgRenderCount, setSvgRenderCount] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const viewRef = useRef<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const { t } = useTranslation();

  const translateName = useCallback(
    (value?: string | null) => {
      if (!value) return value;
      return t(`townships.${value}`, { defaultValue: value });
    },
    [t],
  );

  const toTitleCase = (str: string): string => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getTranslationKey = useCallback((props: TownshipProperties) => {
    return (
      props.TS ||
      props.DT ||
      ""
    );
  }, []);

  const getFeatureName = useCallback(
    (props: TownshipProperties) => {
      const key = getTranslationKey(props);
      const translated = translateName(key);
      return (
        translated ||
        props.TS ||
        props.DT ||
        ""
      );
    },
    [getTranslationKey, translateName],
  );

  const getIdentifierKey = useCallback(
    (props: TownshipProperties) =>
      props.VLG_PCODE ||
      props.VT_PCODE ||
      props.TS_PCODE ||
      props.DT_PCODE ||
      props.ST_PCODE ||
      getFeatureName(props),
    [getFeatureName],
  );

  const ready = useCallback(
    (geoData: TopoJsonData) => {
      if (!choroplethMap.current) return;

      d3.selectAll("svg#chart > *").remove();

      const svg = d3.select(choroplethMap.current);

      let features: any[] = [];
      let mesh: any = null;

      if (geoData.type === "FeatureCollection") {
        features = geoData.features || [];
      } else if (geoData.type === "Topology" && mapMeta.graphObjectName) {
        const topology = topojson.feature(
          geoData,
          geoData.objects[mapMeta.graphObjectName],
        ) as any;
        features = (topology.features as any[]) || [];
        mesh = topojson.mesh(
          geoData,
          geoData.objects[mapMeta.graphObjectName],
        ) as any;
      }

      if (!features.length) {
        console.warn("No features found for map");
        return;
      }

      const projection = d3.geoMercator();

      let width: number;
      let height: number;
      let path: d3.GeoPath;

      if (!svg.attr("viewBox")) {
        const { width: bboxW, height: bboxH } =
          choroplethMap.current.getBoundingClientRect();
        const widthStyle = Math.max(bboxW, 800);
        const heightStyle = Math.max(
          bboxH || widthStyle * 0.7,
          widthStyle * 0.7,
        );
        projection.fitSize(
          [widthStyle, heightStyle],
          { type: "FeatureCollection", features } as any,
        );
        path = d3.geoPath(projection);
        const bBox = path.bounds({ type: "FeatureCollection", features } as any);
        width = +bBox[1][0];
        height = +bBox[1][1];
        svg.attr("viewBox", `0 0 ${width} ${height}`);
      }

      const viewBox = svg.attr("viewBox").split(" ");
      width = +viewBox[2];
      height = +viewBox[3];
      projection.fitSize([width, height], {
        type: "FeatureCollection",
        features,
      } as any);
      path = d3.geoPath(projection);
      path.pointRadius(3);
      viewRef.current = { width, height };

      const colorScale = d3
        .scaleSequential(d3.interpolateYlGnBu)
        .domain([0, Math.max(features.length - 1, 1)]);

      const baseStrokeWidth = Math.max(width / 450, 0.75);

      const zoomLayer = svg.append("g").attr("class", "zoom-layer");
      const g = zoomLayer
        .append("g")
        .attr("class", mapMeta.graphObjectName || "geo-layer");

      const updateTooltip = (event: any, d: any) => {
        if (!choroplethMap.current) return;
        const [x, y] = d3.pointer(event, choroplethMap.current);
        setTooltip({
          name: toTitleCase(getFeatureName(d.properties) || ""),
          district: translateName(d.properties[propertyFieldMap["district"]]),
          state: d.properties[propertyFieldMap["state"]],
          x,
          y,
        });
      };

      g.append("g")
        .attr("class", "states")
        .selectAll("path")
        .data(features)
        .join("path")
        .attr("class", "path-region")
        .attr("fill", (d: any, i: number) => {
          const geomType = d.geometry?.type;
          const isPoint = geomType === "Point" || geomType === "MultiPoint";
          return isPoint ? "#ef4444" : colorScale(i);
        })
        .attr("d", path as any)
        .attr("stroke", "#ffffff")
        .attr("stroke-width", baseStrokeWidth)
        .on("mouseenter", (event: any, d: any) => {
          updateTooltip(event, d);
          d3.select(event.currentTarget).classed("is-hovered", true).raise();
        })
        .on("mousemove", (event: any, d: any) => updateTooltip(event, d))
        .on("mouseleave", (event: any) => {
          setTooltip(null);
          d3.select(event.currentTarget).classed("is-hovered", false);
        })
        .on("click", (event: any, d: any) => {
          event.stopPropagation();
          const name = getFeatureName(d.properties);
          const key = getIdentifierKey(d.properties);
          setSelectedRegion(String(key || name));
          onSelectTownship(d.properties as TownshipProperties);
        });

      if (mesh) {
        g.append("path")
          .attr("class", "borders")
          .attr("stroke", "#94a3b8")
          .attr("fill", "none")
          .attr("stroke-width", baseStrokeWidth)
          .attr("d", path(mesh as any) as any);
      }

      const zoomBehavior = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([1, 6])
        .translateExtent([
          [0, 0],
          [width, height],
        ])
        .on("zoom", (event) => {
          zoomLayer.attr("transform", event.transform);
        });

      zoomRef.current = zoomBehavior;
      svg.call(zoomBehavior as any);

      svg.attr("pointer-events", "auto").on("click", () => {
        setSelectedRegion("");
        onSelectTownship(null);
        setTooltip(null);
      });
    },
    [getFeatureName, getIdentifierKey, mapMeta, onSelectTownship, translateName],
  );

  useEffect(() => {
    const loadMapData = async () => {
      try {
        const data = await d3.json(mapMeta.geoDataFile);
        if (choroplethMap.current && data) {
          ready(data as TopoJsonData);
          setSvgRenderCount((prevCount) => prevCount + 1);
        }
      } catch (error) {
        console.error("Error loading map data:", error);
      }
    };

    loadMapData();
  }, [mapMeta.geoDataFile, ready]);

  useEffect(() => {
    const highlightRegionInMap = (name: string) => {
      const paths = d3.selectAll<SVGPathElement, any>(".path-region");
      paths.classed("is-selected", function (d: any) {
        const node = this as SVGPathElement;
        const key = getIdentifierKey(d.properties);
        const isSelected =
          !!(name && (String(key) === name || getFeatureName(d.properties) === name));
        if (isSelected) {
          node.parentNode?.appendChild(node);
        }
        return isSelected;
      });
    };

    if (selectedRegion) {
      highlightRegionInMap(selectedRegion);
    } else {
      d3.selectAll(".path-region").classed("is-selected", false);
    }
  }, [getFeatureName, getIdentifierKey, svgRenderCount, selectedRegion]);

  const handleZoomButton = (direction: "in" | "out" | "reset") => {
    if (!choroplethMap.current || !zoomRef.current) return;
    const svgSelection = d3.select(choroplethMap.current);
    const { width, height } = viewRef.current;
    const center = [width / 2, height / 2] as [number, number];

    if (direction === "reset") {
      svgSelection
        .transition()
        .duration(250)
        .call(zoomRef.current.transform, d3.zoomIdentity);
      return;
    }

    const scaleBy = direction === "in" ? 1.35 : 0.75;
    svgSelection
      .transition()
      .duration(200)
      .call(zoomRef.current.scaleBy, scaleBy, center);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="svg-parent w-full rounded-xl border border-slate-200 bg-white shadow-sm relative min-h-[65vh]">
        <div className="absolute z-10 top-3 right-3 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => handleZoomButton("in")}
            className="w-10 h-10 rounded-md bg-white border border-slate-200 shadow hover:bg-slate-50 active:scale-95 transition"
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => handleZoomButton("out")}
            className="w-10 h-10 rounded-md bg-white border border-slate-200 shadow hover:bg-slate-50 active:scale-95 transition"
            aria-label="Zoom out"
          >
            –
          </button>
          <button
            type="button"
            onClick={() => handleZoomButton("reset")}
            className="w-10 h-10 rounded-md bg-white border border-slate-200 shadow hover:bg-slate-50 active:scale-95 transition"
            aria-label="Reset zoom"
          >
            ⟳
          </button>
        </div>
        <svg
          id="chart"
          preserveAspectRatio="xMidYMid meet"
          ref={choroplethMap}
          className="w-full h-full block aspect-[4/3]"
        />
        {tooltip && (
          <div
            className="absolute z-10 pointer-events-none bg-slate-900 text-white text-sm px-3 py-2 rounded-md shadow-lg"
            style={{ left: tooltip.x + 12, top: tooltip.y + 12 }}
          >
            <div className="font-semibold">{tooltip.name}</div>
            <div className="text-xs text-slate-200">
              {[tooltip.district, tooltip.state].filter(Boolean).join(" · ")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(ChoroplethMap);
