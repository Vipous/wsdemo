class Graph {
    constructor(params, x) {
        this._data=[];
        this.params = params;
        this.x = x;

        this.line = d3.line()
            .defined(d=>d[this.params.type]==0?null:d)
            .x(d=>this.x(d[this.params.norm]))
            .y(d=>y(d.date_time));

        this.graph = svg.append("g")
        //.attr("clip-path", "url(#clip)")
            .append("path")
            .attr("class", "line "+params.class);

        this.dots = svg.append("g")
            .attr("class", "dots");
    }

    set data(newData){
        this._data=newData;
        this.refresh();
    }

    get data(){
        return this._data;
    }

    refresh(){
        this.refreshDots();
        this.refreshLine();
    }

    refreshDots(){
        this.dots.selectAll(".dot").remove();
        this.dots
            .selectAll(".dot")
            .data(this.data.filter(d=>d!=null&&d[this.params.type]>1))
            .enter().append("circle")
            .attr("class", "dot "+this.params.class)
            .style("fill", (d)=>d[this.params.type]==2?"orange":"red")
            .attr("cx", d=>this.x(d[this.params.norm]))
            .attr("cy", (d, i)=>y(d.date_time))
            .attr("r", 2);
    }

    refreshLine(){
        this.graph.data([this.data]);
        this.graph.attr("d", this.line);
    }

    resize(){
        refresh();
    }
}

class Panel{
    constructor(panel) {
        this.panel = panel;
        //this.x = x(panel.range.apply());

        this.x = d3.scaleLinear().domain([-1, 1]).range(panel.range.apply());
        //this.axisX=this.makeAxisX();
        this.graphs = [];
        panel.lines.forEach(params=>this.makeGraph(params));

        this.axisY=svg.append("g")
             .attr("class", "axis axis--y")
             .attr("transform", "translate(" +this.x(1)  + ",0)")
             .call(d3.axisLeft(y2));

        this.axisY2=svg.append("g")
            .attr("class", "axis axis--y")
            .attr("transform", "translate(" +this.x(-1)  + ",0)")
            .call(d3.axisRight(y2));

        /*this.line = svg.append("line")
            .attr("x1", this.x(1)+spasing)
            .attr("y1", margin.top)
            .attr("x2", this.x(1)+spasing)
            .attr("y2", height)
            .style("stroke-width", 1)
            .style("stroke", "black")
            .style("fill", "none");*/
    }

    makeAxisX(){
        return svg.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom().scale(this.x))
    }

    makeGraph(params){
        this.graphs.push(new Graph(params, this.x));
    }

    set data(newData){
        //svg.datum(data);
        this.graphs.forEach(g=>g.data=newData);
        this.refresh();
    }

    refresh(){
        this.axisY.call(d3.axisLeft(y2));
        this.axisY2.call(d3.axisRight(y2));
        this.graphs.forEach(g=>g.refresh());
    }

    resize(){
        this.line
            .attr("x1", this.x(1)+spasing)
            .attr("y1", margin.top)
            .attr("x2", this.x(1)+spasing)
            .attr("y2", height);
        this.x.range(this.panel.range.apply());
        //this.axisX.attr("transform", "translate(0," + height + ")").call(d3.axisBottom().scale(this.x));
        this.refresh();
    }
}

class Header{
    constructor(){
        var g = svg.append("g");

        this.wob = g
            .append("text")
            .attr("x", margin.left)
            .attr("y", 0)
            .attr("class", "header")
            //.style("fill", "red")
            //.text("WOB: ")
        ;

        this.rop = g
            .append("text")
            .attr("x", 200)
            .attr("y", 0)
            .attr("class", "header")
            //.style("fill", "red")
           //.text("ROP: ")
        ;

        this.rpm = g
            .append("text")
            .attr("x", 400)
            .attr("y", 0)
            .attr("class", "header")
            //.style("fill", "red")
            //.text("RPM: ")
        ;

        this.flw_pmps = g
            .append("text")
            .attr("x", 600)
            .attr("y", 0)
            .attr("class", "header")
            //.style("fill", "red")
            //.text("FLW PMPS: ")
        ;
    }

    set data(newData){
        this._data=newData;
        this.wob
            .style("fill", this.color([this._data.wob_type1, this._data.wob_type2, this._data.wob_type3], "blue"))
            .text("WOB: "+this._data.wob);
        this.rop
            .text("ROP: "+this._data.rop)
            .style("fill", this.color([this._data.rop_type1, this._data.rop_type2, this._data.rop_type3], "green"));
        this.rpm
            .text("RPM: "+this._data.rop)
            .style("fill", this.color([this._data.rpm_type1, this._data.rpm_type2, this._data.rpm_type3], "brown"));
        this.flw_pmps
            .text("FLW PMPS: "+this._data.rpm)
            .style("fill", this.color([this._data.flw_pmps_type1, this._data.flw_pmps_type2, this._data.flw_pmps_type3], "DarkSlateGray"));
    }

    color(array, c){
        var v = d3.max(array);
        if (v==3){
            return "red"
        }
        if (v==2){
            return "orange"
        }
        return c;
    }
}

/*function x(range){
    return d3.scaleLinear()
        .domain([-1, 1])
        .range(range);
}

function line(x) {
    return d3.line()
        .defined(d=>d)
        .x(x)
        .y((d, i)=>y(d.date_time))
        ;
}*/

var stompClient = null;

function connect() {
    var socket = new SockJS('/data');
    stompClient = Stomp.over(socket);
    stompClient.debug = null;
    stompClient.connect({}, frame=>{
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/data', function (simpData) {
            return parseData(JSON.parse(simpData.body));
        });
    });
}

function disconnect() {
    if (stompClient != null) {
        stompClient.disconnect();
    }
    console.log("Disconnected");
}

var n = 720,
    duration = 5000,
    now = Date.now(),
    data = [];

var margin = {top: 20, right: 40, bottom: 20, left: 40},
    width = parseInt(d3.select("#graph").style("width")) - margin.left - margin.right,
    height = parseInt(d3.select("#graph").style("height")) - margin.top - margin.bottom,
    spasing = 20;

var svg = d3.select("#graph")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var y = d3.scaleTime()
    .domain([now-duration*n, now])
    .range([margin.top, height]);

var y2 = d3.scaleLinear()
    .domain([0, 100])
    .range([margin.top, height]);

var axisY=svg.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y).tickFormat(d3.timeFormat("%H:%M")));

/*var axisY2=svg.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisRight(y2));*/

var panel1 = {
    range: ()=>[0, width/3],
    lines: [
        {
            type: "wob_type1",
            norm: "wob_norm",
            class: "wod"
        },
        {
            type: "rop_type1",
            norm: "rop_norm",
            class: "rop"
        },
        {
            type: "rpm_type1",
            norm: "rpm_norm",
            class: "rpm"
        },
        {
            type: "flw_pmps_type1",
            norm: "flw_pmps_norm",
            class: "flw"
        }
    ]
};

var panel2 = {
    range: ()=>[width/3, width/3*2],
    lines: [
        {
            type: "wob_type2",
            norm: "wob_norm",
            class: "line wod"
        },
        {
            type: "rop_type2",
            norm: "rop_norm",
            class: "line rop"
        },
        {
            type: "rpm_type2",
            norm: "rpm_norm",
            class: "line rpm"
        },
        {
            type: "flw_pmps_type2",
            norm: "flw_pmps_norm",
            class: "line flw"
        }
    ]
};

var panel3 = {
    range: ()=>[width/3*2, width],
    lines: [
        {
            type: "wob_type3",
            norm: "wob_norm",
            class: "line wod"
        },
        {
            type: "rop_type3",
            norm: "rop_norm",
            class: "line rop"
        },
        {
            type: "rpm_type3",
            norm: "rpm_norm",
            class: "line rpm"
        },
        {
            type: "flw_pmps_type3",
            norm: "flw_pmps_norm",
            class: "line flw"
        }
    ]
};

var panels = [new Panel(panel1), new Panel(panel2), new Panel(panel3)];
var header = new Header();

/*svg.append("defs").append("clipPath")
        .attr("id", "clip")
    .append("rect")
        .attr("width", width)
        .attr("height", height);*/

function tickTime() {
    formatYDomain(y);
    panels.forEach(p=>p.refresh());
}

function resize() {
    width = parseInt(d3.select("#graph").style("width")) - margin.left - margin.right;
    height = parseInt(d3.select("#graph").style("height")) - margin.top - margin.bottom;

    y.range([0, height]);
    y2.range([0, height]);
    axisY.call(d3.axisLeft(y).tickFormat(d3.timeFormat("%H:%M")));
    //axisY2.call(d3.axisRight(y2));

    panels.forEach(p=>p.resize());
}

function parseData(simpData) {
    simpData.forEach((d)=>{
        d.date_time = new Date(d.date_time);
    });
    data = simpData;
    header.data=data[data.length-1];
    formatYDomain();
    panels.forEach(p=>p.data=data);
}

function formatYDomain(){
    y.domain(d3.extent(data, d=>d.date_time));
    y2.domain(d3.extent(data, d=>d.bit_depth));

    axisY
        //.transition()
        //.duration(100)
        //.ease(d3.easeLinear)
        .call(d3.axisLeft(y)/*.tickSize(-width)*/.tickFormat(d3.timeFormat("%H:%M")));
    /*axisY2
        //.transition()
        //.duration(100)
        //.ease(d3.easeLinear)
        .call(d3.axisRight(y2));*/
}

d3.select(window).on('resize', resize);
//resize();
connect();

/////MOUSE LINE
var bisectDate = d3.bisector(d=>d.date_time).left;
var x = panels[0].x;

var focus = svg.append("g")
    .style("display", "none");

// append the x line
/*focus.append("line")
    .attr("class", "x")
    .style("stroke", "blue")
    .style("stroke-dasharray", "3,3")
    .style("opacity", 0.5)
    .attr("y1", 0)
    .attr("y2", height);*/

// append the y line
focus.append("line")
    .attr("class", "y")
    .style("stroke", "blue")
    .style("stroke-dasharray", "3,3")
    .style("opacity", 0.5)
    .attr("x1", width)
    .attr("x2", width);

// append the circle at the intersection
/*focus.append("circle")
    .attr("class", "y")
    .style("fill", "none")
    .style("stroke", "blue")
    .attr("r", 4);*/

// place the value at the intersection
/*focus.append("text")
    .attr("class", "y1")
    .style("stroke", "white")
    .style("stroke-width", "3.5px")
    .style("opacity", 0.8)
    .attr("dx", 8)
    .attr("dy", "-.3em");*/
focus.append("text")
    .attr("class", "y2")
    .attr("dx", 8)
    .attr("dy", "-.3em");

svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "none")
    .style("pointer-events", "all")
    .on("mouseover", function() { focus.style("display", null); })
    .on("mouseout", function() { focus.style("display", "none"); })
    .on("mousemove", mousemove);

function mousemove() {
    var x0 = y.invert(d3.mouse(this)[1]),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i];
    if (d0==undefined || d1==undefined) return;
    var  d = x0 - d0.date_time > d1.date_time - x0 ? d1 : d0;

    /*focus.select("circle.y")
        .attr("transform",
            "translate(" + x(d.wob_norm) + "," + y(d.date_time) + ")");*/

/*    focus.select("text.y1")
        .attr("transform",
            "translate(" + x(d.wob_norm) + "," + y(d.date_time) + ")")
        .text(d.wob);*/

    focus.select("text.y2")
        .attr("transform",
            "translate(" + d3.mouse(this)[0] + "," + y(d.date_time) + ")")
        .text(`WOB: ${d.wob} ROP: ${d.rop} RPM: ${d.rpm} FLW PMPS: ${d.flw_pmps}` );

    /*focus.select("text.y3")
        .attr("transform",
            "translate(" + x(d.wob_norm) + "," + y(d.date_time) + ")")
        .text(d.wob_norm);

    focus.select("text.y4")
        .attr("transform",
            "translate(" + x(d.wob_norm) + "," + y(d.date_time) + ")")
        .text(d.wob_norm);*/

/*    focus.select(".x")
        .attr("transform",
            "translate(" + x(d.wob_norm) + "," + y(d.date_time) + ")")
        .attr("y2", height - y(d.date_time));*/

    focus.select(".y")
        .attr("transform",
            "translate(" + width * -1 + "," + y(d.date_time) + ")")
        .attr("x2", width + width);
}