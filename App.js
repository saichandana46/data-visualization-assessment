// App.js

// parse tsv file - converts to list of objects
d3.tsv("colleges.tsv")
  .then((tsvData) => {
    // Visualization of Median Earnings by Institution
    // console.log(typeof tsvData, tsvData)
    // data cleanup, filtering and
    const data = tsvData
      .map((d) => ({
        institution_name: d.institution_name,
        median_earnings: +d.median_earnings,
      }))
      .filter((d) => !isNaN(d.median_earnings));

    // Extract majors dynamically from data fields
    // const data = majors.map((major) => {
    //   const earningsForMajor = tsvData
    //     .map((d) => +d.median_earnings) // Use "median_earnings" field
    //     .filter((value) => !isNaN(value));

    //   return {
    //     name: major.replace("_major_perc", ""),
    //     median_earnings: d3.median(earningsForMajor),
    //   };
    // });

    // setting the sizes
    const margin = { top: 40, right: 20, bottom: 80, left: 80 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // xscale and yscale params
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.institution_name))
      .range([0, width])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.median_earnings)])
      .range([height, 0]);

    // Tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "lightgray") // Set the background color
      .style("padding", "8px")
      .style("border-radius", "5px");

      // svg container
    const svg = d3
      .select("body")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 0 - margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .style("text-decoration", "underline")
      .text("Median Earnings by Institution");

    svg
      .selectAll(".bar-earnings")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar-earnings")
      .attr("x", (d) => xScale(d.institution_name))
      .attr("y", (d) => yScale(d.median_earnings))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => height - yScale(d.median_earnings))
      .attr("fill", "orange")
      // hover and click effects
      .on("mouseover", function (event, d) {
        d3.select(this).attr("fill", "red");
        tooltip
          .transition()
          .duration(200)
          .style("opacity", 0.9)
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
        tooltip.html(
          `Institution: ${
            d.institution_name
          }<br>Median Earnings: $${d.median_earnings.toLocaleString()}`
        );
      })
      .on("mouseout", function (event, d) {
        d3.select(this).attr("fill", (d) => colorScale(d.median_earnings));
        // Hide tooltip
        tooltip.transition().duration(500).style("opacity", 0);
      })
      .on("click", function (event, d) {
        d3.select(this).attr("fill", "blue");
        tooltip
          .transition()
          .duration(200)
          .style("opacity", 0.9)
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
        tooltip.html(
          `Institution: ${
            d.institution_name
          }<br>Median Earnings: $${d.median_earnings.toLocaleString()}`
        );
      });

    // Add x-axis
    // svg
    //   .append("g")
    //   .attr("transform", `translate(0,${height})`)
    //   .call(d3.axisBottom(xScale))
    //   .selectAll("text")
    //   .style("text-anchor", "end")
    //   .attr("transform", "rotate(-45)")
    //   .attr("dx", "0.0em") // Adjust the text position
    //   .attr("dy", "0.5em");

    // Add y-axis
    svg
      .append("g")
      .call(d3.axisLeft(yScale))
      .selectAll(".tick text")
      .style("text-anchor", "end")
      .attr("dx", "-0.5em")
      .attr("dy", "0.25em");

    // Add axis labels
    svg
      .append("text")
      .attr("transform", `translate(${width / 2},${height + margin.top + 30})`)
      .style("text-anchor", "middle")
      .text("Institution");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Median Earnings");

    // Scatter plot for SAT Scores vs Employment Outcomes after graduation
    const scatterData = tsvData
      .map((d) => ({
        sat_score: calculateSatScore(d),
        median_earnings: +d.median_earnings,
      }))
      .filter((d) => !isNaN(d.sat_score) && !isNaN(d.median_earnings));

    const marginScatter = { top: 40, right: 20, bottom: 80, left: 80 };
    const widthScatter = 800 - marginScatter.left - marginScatter.right;
    const heightScatter = 400 - marginScatter.top - marginScatter.bottom;

    const xScaleScatter = d3
      .scaleLinear()
      .domain([0, d3.max(scatterData, (d) => d.sat_score)])
      .range([0, widthScatter]);

    const yScaleScatter = d3
      .scaleLinear()
      .domain([0, d3.max(scatterData, (d) => d.median_earnings)])
      .range([heightScatter, 0]);

    const colorScale = d3
      .scaleSequential(d3.interpolateBlues)
      .domain([0, d3.max(scatterData, (d) => d.sat_score)]);

    const tooltipScatter = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "lightgray")
      .style("padding", "8px")
      .style("border-radius", "5px");

    const svgScatter = d3
      .select("body")
      .append("svg")
      .attr("width", widthScatter + marginScatter.left + marginScatter.right)
      .attr("height", heightScatter + marginScatter.top + marginScatter.bottom)
      .append("g")
      .attr(
        "transform",
        `translate(${marginScatter.left},${marginScatter.top})`
      );

    svgScatter
      .append("text")
      .attr("x", width / 2)
      .attr("y", 0 - margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .style("text-decoration", "underline")
      .text("SAT Scores Vs Employment outcomes");

    svgScatter
      .selectAll(".point")
      .data(scatterData)
      .enter()
      .append("circle")
      .attr("class", "point")
      .attr("cx", (d) => xScaleScatter(d.sat_score))
      .attr("cy", (d) => yScaleScatter(d.median_earnings))
      .attr("r", 5)
      .attr("fill", (d) => colorScale(d.sat_score))
      .attr("opacity", 0.7)
      .on("mouseover", function (event, d) {
        d3.select(this).attr("fill", "red");
        const tooltipWidth = 100;
        tooltipScatter
          .transition()
          .duration(200)
          .style("opacity", 0.9)
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 10 + "px");
        tooltipScatter
          .html(
            `SAT Score: ${d.sat_score}<br>Median Earnings: ${d.median_earnings}`
          )
          .style("max-width", `${tooltipWidth}px`);
      })
      .on("mouseout", function (event, d) {
        d3.select(this).attr("fill", (d) => colorScale(d.sat_score));
        // Hide tooltip
        tooltipScatter.transition().duration(500).style("opacity", 0);
      })
      .on("click", function (event, d) {
        d3.select(this).attr("fill", "blue");
        // Show tooltip with values
        tooltipScatter
          .transition()
          .duration(200)
          .style("opacity", 0.9)
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
        tooltipScatter.html(
          `SAT Score: ${d.sat_score}<br>Median Earnings: ${d.median_earnings}`
        );
      });

    svgScatter
      .append("g")
      .attr("transform", `translate(0,${heightScatter})`)
      .call(d3.axisBottom(xScaleScatter));

    svgScatter
      .append("g")
      .call(d3.axisLeft(yScaleScatter))
      .selectAll(".tick text")
      .style("text-anchor", "end")
      .attr("dx", "-0.5em")
      .attr("dy", "0.25em");
    svgScatter
      .append("text")
      .attr(
        "transform",
        `translate(${widthScatter / 2},${
          heightScatter + marginScatter.top + 30
        })`
      )
      .style("text-anchor", "middle")
      .text("SAT Score");

    svgScatter
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - marginScatter.left)
      .attr("x", 0 - heightScatter / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Median Earnings");

    // Function to calculate SAT Score
    function calculateSatScore(d) {
      const quartiles = [
        "sat_verbal_quartile_1",
        "sat_verbal_quartile_2",
        "sat_verbal_quartile_3",
        "sat_math_quartile_1",
        "sat_math_quartile_2",
        "sat_math_quartile_3",
        "sat_writing_quartile_1",
        "sat_writing_quartile_2",
        "sat_writing_quartile_3",
      ];
      const validQuartiles = quartiles.filter((ql) => !isNaN(+d[ql]));
      if (validQuartiles.length === 0) {
        return NaN;
      }
      return (
        validQuartiles.reduce((sum, ql) => sum + +d[ql], 0) /
        validQuartiles.length
      );
    }

    // Altnerative Colleges to Top 50 for best outcomes

    // Filtering institutions in the US News Top 50
    const top50Institutions = tsvData.filter((d) => d.top_50 === "TRUE");

    // Filtering institutions outside the Top 50 list
    const nonTop50Institutions = tsvData.filter((d) => d.top_50 === "FALSE");

    const calculateMedianCost = (data) => {
      return d3.median(data, (d) => +d.cost);
    };

    // Calculate median cost for both groups
    const top50MedianCost = calculateMedianCost(top50Institutions);
    const nonTop50MedianCost = calculateMedianCost(nonTop50Institutions);

    // Function to calculate median earnings
    const calculateMedianEarnings = (data) => {
      return d3.median(data, (d) => +d.median_earnings);
    };

    // Calculate median earnings for both groups
    const top50MedianEarnings = calculateMedianEarnings(top50Institutions);
    const nonTop50MedianEarnings =
      calculateMedianEarnings(nonTop50Institutions);

    // Function to handle NaN values
    const handleNaN = (value) => (isNaN(value) ? 0 : value);
    const comparisonData = [
      {
        category: "US News Top 50",
        median_earnings: handleNaN(top50MedianEarnings),
        cost: handleNaN(top50MedianCost),
      },
      {
        category: "Non Top 50",
        median_earnings: handleNaN(nonTop50MedianEarnings),
        cost: handleNaN(nonTop50MedianCost),
      },
    ];

    const svgAlt = d3
      .select("body")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    svgAlt
      .append("text")
      .attr("x", width / 2)
      .attr("y", 0 - margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .style("text-decoration", "underline")
      .text("Affordable Alternatives to Top 50");

    // Set up scales
    const xScaleAlt = d3
      .scaleBand()
      .domain(comparisonData.map((d) => d.category))
      .range([0, width])
      .padding(0.1);

    const tooltipAlt = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "lightgray")
      .style("padding", "8px")
      .style("border-radius", "5px");

    const yScaleAlt = d3
      .scaleLinear()
      .domain([0, d3.max(comparisonData, (d) => d.median_earnings)])
      .range([height, 0]);

    svgAlt
      .selectAll(".bar-alt")
      .data(comparisonData)
      .enter()
      .append("rect")
      .attr("class", "bar-alt")
      .attr("x", (d) => xScaleAlt(d.category))
      .attr("width", xScaleAlt.bandwidth() / 2)
      .attr("y", (d) => yScaleAlt(d.median_earnings))
      .attr("height", (d) => height - yScaleAlt(d.median_earnings))
      .attr("fill", "orange")
      .on("mouseover", function (event, d) {
        tooltipAlt.transition().duration(200).style("opacity", 0.9);
        tooltipAlt
          .html(
            `Category: ${d.category}<br>Median Earnings: ${d.median_earnings}`
          )
          .style("left", event.pageX + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function (d) {
        tooltipAlt.transition().duration(500).style("opacity", 0);
      });

    svgAlt
      .selectAll(".bar-cost")
      .data(comparisonData)
      .enter()
      .append("rect")
      .attr("class", "bar-cost")
      .attr("x", (d) => xScaleAlt(d.category) + xScaleAlt.bandwidth() / 2)
      .attr("width", xScaleAlt.bandwidth() / 2)
      .attr("y", (d) => yScaleAlt(d.cost))
      .attr("height", (d) => height - yScaleAlt(d.cost))
      .attr("fill", "blue")
      .on("mouseover", function (event, d) {
        tooltipAlt.transition().duration(200).style("opacity", 0.9);
        tooltipAlt
          .html(`Category: ${d.category}<br>Median Cost: ${d.cost}`)
          .style("left", event.pageX + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function (d) {
        tooltipAlt.transition().duration(500).style("opacity", 0);
      });

    svgAlt
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScaleAlt));

    svgAlt
      .append("g")
      .call(d3.axisLeft(yScaleAlt))
      .selectAll(".tick text")
      .style("text-anchor", "end")
      .attr("dx", "-0.5em")
      .attr("dy", "0.25em");

    svgAlt
      .append("text")
      .attr("transform", `translate(${width / 2},${height + margin.top + 10})`)
      .style("text-anchor", "middle")
      .text("Institution Category");

    svgAlt
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Median Earnings and Cost");

    //  Visualizing alternative affordable institutions for Top 50 by difference of cost and earnings of an institution
    const top50Data = top50Institutions.map((d) => {
      const difference = +d.median_earnings - +d.cost;
      return {
        institution: d.institution_name,
        difference: handleNaN(difference),
      };
    });

    const filteredNonTop50Data = nonTop50Institutions
      .map((d) => ({
        institution: d.institution_name,
        difference: handleNaN(+d.median_earnings - +d.cost),
      }))
      .filter((d) => d.difference > 25000);

    const filterNegativeDifference = (data) =>
      data.filter((d) => d.difference >= 0);
    // Filtered data for Top 50
    const filteredTop50Data = filterNegativeDifference(top50Data);

    const svgTop50 = d3
      .select("body")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .text(
        "Comparing Diff of Median Earnings and Cost for Top50 Institutions"
      );

    // Set up scales for Top 50
    const xScaleTop50 = d3
      .scaleBand()
      .domain(filteredTop50Data.map((d) => d.institution))
      .range([0, width])
      .padding(0.1);

    const yScaleTop50 = d3
      .scaleLinear()
      // .domain(d3.extent(filteredTop50Data, d => d.difference))
      .domain([0, d3.max(filteredTop50Data, (d) => Math.abs(d.difference))])
      .range([height, 0]);

    const tooltipTop50 = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "beige")
      .style("padding", "8px")
      .style("border-radius", "5px");
    // Create bars for the difference between median earnings and cost for Top 50
    svgTop50
      .selectAll(".bar-difference-top50")
      .data(filteredTop50Data)
      .enter()
      .append("rect")
      .attr("class", "bar-difference-top50")
      .attr("x", (d) => xScaleTop50(d.institution))
      .attr("width", xScaleTop50.bandwidth())
      .attr("y", (d) => {
        if (d.difference >= 0) {
          return yScaleTop50(Math.abs(d.difference));
        } else {
          // If the difference is negative, set the y attribute to the y-coordinate of 0
          return yScaleTop50(0);
        }
      })
      .attr("height", (d) => {
        return Math.abs(yScaleTop50(0) - yScaleTop50(Math.abs(d.difference)));
      })
      .attr("fill", (d) => (d.difference >= 0 ? "green" : "red"))
      .on("mouseover", function (event, d) {
        tooltipTop50.transition().duration(200).style("opacity", 0.9);
        tooltipTop50
          .html(
            `<strong>${d.institution}</strong><br/>Difference: ${d.difference}`
          )
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", function (event, d) {
        tooltipTop50.transition().duration(2000).style("opacity", 0);
      });

    // Add a horizontal line at y=0 to indicate zero difference for Top 50
    // svgTop50.append('line')
    //   .attr('x1', 0)
    //   .attr('y1', yScaleTop50(0))
    //   .attr('x2', width)
    //   .attr('y2', yScaleTop50(0))
    //   .attr('stroke', 'black');

    // Add axes for Top 50
    // svgTop50.append('g')
    //   .attr('transform', `translate(0,${height})`)
    //   .call(d3.axisBottom(xScaleTop50));

    svgTop50
      .append("g")
      .call(d3.axisLeft(yScaleTop50))
      .selectAll(".tick text")
      .style("text-anchor", "end")
      .attr("dx", "-0.5em")
      .attr("dy", "0.25em");

    svgTop50
      .append("text")
      .attr("transform", `translate(${width / 2},${height + margin.top + 10})`)
      .style("text-anchor", "middle")
      .text("Institutions (Top 50)");

    svgTop50
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Median Earnings - Median Cost");

    //
    const svgNonTop50 = d3
      .select("body")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .text(
        "Comparing Diff of Median Earnings and Cost for NonTop50 Institutions"
      );

    const xScaleNonTop50 = d3
      .scaleBand()
      .domain(filteredNonTop50Data.map((d) => d.institution))
      .range([0, width])
      .padding(0.1);

    const yScaleNonTop50 = d3
      .scaleLinear()
      // .domain(d3.extent(filteredNonTop50Data, d => d.difference))
      .domain([0, d3.max(filteredNonTop50Data, (d) => Math.abs(d.difference))])
      .range([height, 0]);

    const tooltipNonTop50 = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "beige")
      .style("padding", "8px")
      .style("border-radius", "5px");
    svgNonTop50
      .selectAll(".bar-difference-non-top50")
      .data(filteredNonTop50Data)
      .enter()
      .append("rect")
      .attr("class", "bar-difference-non-top50")
      .attr("x", (d) => xScaleNonTop50(d.institution))
      .attr("width", xScaleNonTop50.bandwidth())
      .attr("y", (d) => {
        if (d.difference >= 0) {
          return yScaleNonTop50(Math.abs(d.difference));
        } else {
          // If the difference is negative, set the y attribute to the y-coordinate of 0
          return yScaleNonTop50(0);
        }
      })
      .attr("height", (d) => {
        return Math.abs(
          yScaleNonTop50(0) - yScaleNonTop50(Math.abs(d.difference))
        );
      })
      .attr("fill", (d) => (d.difference >= 0 ? "green" : "red"))
      .on("mouseover", function (event, d) {
        tooltipNonTop50.transition().duration(200).style("opacity", 0.9);
        tooltipNonTop50
          .html(
            `<strong>${d.institution}</strong><br/>Difference: ${d.difference}`
          )
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", function (event, d) {
        tooltipNonTop50.transition().duration(5000).style("opacity", 0);
      })
      .on("click", function (event, d) {
        tooltipNonTop50.transition().duration(200).style("opacity", 0.9);
        tooltipNonTop50
          .html(
            `<strong>${d.institution}</strong><br/>Difference: ${d.difference}`
          )
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY - 28}px`);
      });

    svgNonTop50
      .append("line")
      .attr("x1", 0)
      .attr("y1", yScaleNonTop50(0))
      .attr("x2", width)
      .attr("y2", yScaleNonTop50(0))
      .attr("stroke", "black");

    // svgNonTop50.append('g')
    //   .attr('transform', `translate(0,${height})`)
    //   .call(d3.axisBottom(xScaleNonTop50));

    svgNonTop50
      .append("g")
      .call(d3.axisLeft(yScaleNonTop50).ticks(5))
      .selectAll(".tick text")
      .style("text-anchor", "end")
      .attr("dx", "-0.5em")
      .attr("dy", "0.25em");

    svgNonTop50
      .append("text")
      .attr("transform", `translate(${width / 2},${height + margin.top + 10})`)
      .style("text-anchor", "middle")
      .text("Institution (Non Top 50)");

    svgNonTop50
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Median Earnings - Median Cost");
  })
  .catch((error) => console.log("Error loading data:", error));
