import { Graph } from "react-d3-graph18";
import React from "react";
import { useNavigate } from "react-router-dom";
import CustomNode from "./custom-node";
import { Routes } from "../../routes";

interface GraphProps {
  graph: any;
}
export const StudentGraph = (props: GraphProps) => {
  const navigate = useNavigate();

  // graph configuration
  const myConfig = {
    automaticRearrangeAfterDropNode: true,
    collapsible: false,
    directed: false,
    focusAnimationDuration: 0.75,
    focusZoom: 1,
    freezeAllDragEvents: false,
    height: window.innerHeight - 190,
    highlightDegree: 0,
    highlightOpacity: 0.2,
    linkHighlightBehavior: false,
    maxZoom: 5,
    minZoom: 0.5,
    nodeHighlightBehavior: true,
    panAndZoom: false,
    staticGraph: false,
    staticGraphWithDragAndDrop: false,
    width: window.innerWidth,
    d3: {
      alphaTarget: 0.05,
      gravity: -250,
      linkLength: 160,
      linkStrength: 2,
      disableLinkForce: false,
    },
    node: {
      color: "#d3d3d3",
      fontColor: "var(--cds-text-primary)",
      fontSize: 18,
      fontWeight: "normal",
      highlightColor: "red",
      highlightFontSize: 20,
      highlightFontWeight: "bold",
      highlightStrokeColor: "red",
      highlightStrokeWidth: 1.5,
      labelProperty: "name",
      mouseCursor: "pointer",
      opacity: 1,
      labelPosition: "bottom",
      renderLabel: true,
      size: 500,
      strokeColor: "none",
      strokeWidth: 1.5,
      symbolType: "circle",
      viewGenerator: node => <CustomNode person={node} />,
    },
    link: {
      color: "var(--cds-text-primary)",
      fontColor: "black",
      fontSize: 8,
      fontWeight: "normal",
      labelProperty: "label",
      mouseCursor: "cursor",
      opacity: 1,
      renderLabel: false,
      semanticStrokeWidth: true,
      strokeWidth: 3,
      markerHeight: 6,
      markerWidth: 6,
      type: "straight",
      strokeDasharray: 0,
      strokeDashoffset: 0,
      strokeLinecap: "round",
    },
  };

  const onClickNode = nodeId => {
    // redirect to user portfolio when node is clicked
    navigate(Routes.PORTFOLIO(nodeId));
  };

  return (
    <Graph
      id="graph-id"
      data={props.graph}
      config={myConfig}
      onClickNode={onClickNode}
    />
  );
};
