import React from "react";
import { useHistory } from "react-router-dom";
import { Line } from "react-chartjs-2";
import moment from "moment";
import parseChartData from "./helpers/parser";

/** React component which renders the chart */
function Chart(props) {
  const { data } = props;
  const history = useHistory();

  function onClickHandler(elements) {
    if (elements && elements[0]) {
      const { _datasetIndex, _index } = elements[0];
      const { x, y } = elements[0]._chart.data.datasets[_datasetIndex].data[
        _index
      ];
      const date = moment(x).format("YYYY-MM-DD");
      const m3 = y;

      history.push(
        "/edit?" +
          new URLSearchParams([
            ["date", date],
            ["m3", m3],
          ]).toString()
      );
    }
  }

  return (
    <Line
      data={parseChartData(data)}
      options={getOptions()}
      onElementsClick={onClickHandler}
    />
  );
}

function getOptions() {
  return {
    legend: {
      display: false,
    },

    scales: {
      xAxes: [
        {
          type: "time",
          time: {
            unit: "day",
          },
        },
      ],
      yAxes: [
        {
          id: "m3",
          type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
          display: true,
          position: "left",
          scaleLabel: {
            display: true,
            labelString: "water counter [m3]",
          },
          ticks: {
            beginAtZero: true,
          },
        },
        {
          id: "note",
          type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
          display: false,
          position: "right",
          ticks: {
            beginAtZero: true,
            max: 1,
          },
        },
      ],
    },
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          const dsIndex = tooltipItem.datasetIndex;
          let axisLabel = data.datasets[dsIndex].label || "";

          if (axisLabel) {
            axisLabel += ": ";
          }

          if (data.datasets[dsIndex].label === "note") {
            const pointLabel =
              data.datasets[dsIndex].data[tooltipItem.index].label || "";
            axisLabel += pointLabel;
          } else {
            const pointLabel =
              data.datasets[dsIndex].data[tooltipItem.index].y || "";
            axisLabel += pointLabel;
          }
          return axisLabel;
        },
      },
    },
  };
}

export default Chart;
