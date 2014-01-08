// xsection.js - Interactive timeline visualization
// Copyright 2014, Edward L. Platt
// Licensed under BSD 3-clause license, see LICENSE for info

// This code is a mess, I hope to clean it up soon. -Ed 2014-01-08

var activeSeason = -1;

var eventHeight = 15;
var legendWidth = 30;
var margin = {
  "top": 15
  , "bottom": 15
  , "left": 5
  , "right": 20
};

var getX = function () {
  var x = d3.scale.linear();
  x.domain([start, end]);
  x.range([0, getContentWidth()]);
  return x;
}

var layout = function (eventData, typeData) {
  assigned = []
  for (var i = 0; i < eventData.length; i++) {
    eventData[i]["uid"] = i;
    type = eventData[i]["type"];
    position = nextPosition(assigned, eventData[i]);
    eventData[i]["position"] = position;
    assigned.push(eventData[i]);
    // Update max and min index
    if (typeof(typeData[type]["min"]) === "undefined" || typeData[type]["min"] > position) {
      typeData[type]["min"] = position;
    }
    if (typeof(typeData[type]["max"]) === "undefined" || typeData[type]["max"] < position) {
      typeData[type]["max"] = position;
    }
  }
  offset = 0;
  for (type in typeData) {
    typeData[type]["offset"] = offset;
    var rows = typeData[type]["max"] - typeData[type]["min"] + 1
    typeData[type]["height"] = Math.max(rows * eventHeight, legendWidth) + 2;
    offset += Math.floor(typeData[type]["height"] + 0.5 * eventHeight);
  }
  getEventSeasons(eventData);
};

var getContentHeight = function(typeData) {
  height = 0;
  for (type in typeData) {
    height = 2 + Math.max(height, typeData[type]["offset"] + typeData[type]["height"] + 1*eventHeight);
  }
  return height;
};

var nextPosition = function (events, nextEvent) {
  taken = []
  for (var i = 0; i < events.length; i++) {
    if (overlap(events[i], nextEvent)) {
      taken.push(events[i]["position"]);
    }
  }
  var pos = 0;
  while (taken.indexOf(pos) > -1) {
    // Try next positive integer
    pos = Math.abs(pos) + 1;
    // Try next negative integer
    if (taken.indexOf(pos) > -1) {
      pos *= -1;
    }
  }
  return pos;
};

var overlap = function (event, nextEvent) {
  if (event["type"] !== nextEvent["type"]) {
    return false;
  }
  if (event["start"] >= nextEvent["start"] && event["start"] < nextEvent["end"]) {
    return true;
  }
  if (event["end"] > nextEvent["start"] && event["end"] <= nextEvent["end"]) {
    return true;
  }
  if (nextEvent["start"] >= event["start"] && nextEvent["start"] < event["end"]) {
    return true;
  }
  if (nextEvent["end"] > event["start"] && nextEvent["end"] <= event["end"]) {
    return true;
  }
  return false;
};

var getBackgroundColor = function (d) {
  n = Math.round(d * 4);
  if (n % 4 == 0) { return '#b8b8b6'; }
  else if (n % 4 == 1) { return '#b8b12e'; }
  else if (n % 4 == 2) { return '#849ab8'; }
  else { return '#b89265'; }
};

var drawBackground = function (width, height) {
  var count = Math.round((end - start)*4);
  var seasons = [];
  for (var i = 0; i < count; i++) {
    seasons.push(start + i/4.0);
  }
  var years = [];
  for (i = 0; i < Math.round(end - start); i++) {
    years.push(start + i);
  }
  var scale = d3.scale.linear();
  scale.domain([start, end]);
  scale.range([0, width])
  var bg = d3.selectAll('.bg');
  var seasons = bg.selectAll('.season').data(seasons);
  seasons.enter()
    .append('rect').classed('season', true)
  seasons
    .attr('x', scale).attr('y', '0')
    .attr('width', function (d) { return scale(d + 0.25) - scale(d); })
    .attr('height', height)
    .attr('fill', getBackgroundColor);
  var years = bg.selectAll('.year').data(years);
  years.enter().append('rect').classed('year', true)
  years
    .attr('x', scale).attr('y', '0')
    .attr('width', function (d) { return scale(d + 1) - scale(d); })
    .attr('height', height)
    .attr('fill', 'url(#grad1)')
}

var drawLegend = function (elt, typeData) {
  var keys = [];
  for (type in typeData) {
    keys.push(type);
  }
  var group = elt.selectAll('.type').data(keys);
  group.enter()
    .append('g').classed('type', true)
  group
    .attr('transform', function (d) { return 'translate(' + margin.left + ',' + (typeData[d]["offset"] + eventHeight/2.0) + ')'; })
    .append('image')
      .attr('width', legendWidth)
      .attr('height', legendWidth)
      .attr('xlink:href', function (d) { return typeData[d]['img']; });
};

var drawTopAxis = function (elt, width) {
  years = [];
  for (var i = 0; i < Math.round(end - start); i++) {
    years.push(start + i);
  }
  var scale = d3.scale.linear().domain([start, end]).range([legendWidth, width + legendWidth])
  var ticks = elt.selectAll('.tick').data(years);
  ticks.enter().append('text').classed('tick', true)
  ticks
    .attr('x', scale)
    .attr('y', margin.top - 4)
    .attr('fill', '#e0e0e0')
    .attr('font-size', (scale(start+1) - scale(start)) / 3.5 + 'px')
    .text(function(d) { return d; });
}

var drawBottomAxis = function (elt, width) {
  years = [];
  for (var i = 0; i < Math.round(end - start); i++) {
    years.push(start + i);
  }
  var scale = d3.scale.linear().domain([start, end]).range([legendWidth, width + legendWidth])
  elt.selectAll('tick').data(years)
    .enter()
      .append('text').classed('tick', true)
    .update()
      .attr('x', scale)
      .attr('y', margin.bottom)
      .attr('fill', '#e0e0e0')
      .attr('font-size', '11px')
      .text(function(d) { return d; });
}

var drawSeasonIndicator = function (width, height) {
  var scale = d3.scale.linear();
  scale.domain([0, Math.round((end - start)*4)]);
  scale.range([0, width])
  var content = d3.select('.content');
  var indicator = content.selectAll('.indicator').data([activeSeason]);
  indicator.enter().append('rect').classed('indicator', true);
  indicator
    .attr('x', function (d) { return scale(d) })
    .attr('y', '0')
    .attr('height', height)
    .attr('width', scale(1) - scale(0))
    .attr('fill', '#79bedb')
    .attr('opacity', (activeSeason >= 0) ? 1 : 0);
}

var addListeners = function (eventData, typeData) {
  var contentWidth = getContentWidth();
  var contentHeight = getContentHeight(typeData);
  var count = Math.round((end - start)*4);
  var seasons = [];
  for (var i = 0; i < count; i++) {
    seasons.push(start + i/4.0);
  }
  var years = [];
  for (i = 0; i < Math.round(end - start); i++) {
    years.push(start + i);
  }
  var scale = d3.scale.linear();
  scale.domain([start, end]);
  scale.range([0, contentWidth])
  var content = d3.selectAll('.listeners');
  var seasons = content.selectAll('.season-listener').data(seasons);
  seasons.enter()
    .append('rect').classed('season-listener', true);
  seasons.exit().remove();
  seasons
    .attr('x', scale).attr('y', '0')
    .attr('width', function (d) { return scale(d + 0.25) - scale(d); })
    .attr('height', contentHeight)
    .attr('opacity', '0')
    .on('mousemove', function (d, i) {
      activeSeason = i;
      drawSeasonIndicator(contentWidth, contentHeight)
      drawEvents(eventData, typeData);
      updateNarrative(eventData, typeData);
    })
    .on('mouseover', function (d, i) {
      activeSeason = i;
      drawSeasonIndicator(contentWidth, contentHeight)
      drawEvents(eventData, typeData);
      updateNarrative(eventData, typeData);
    })
    .on('mouseout', function (d, i) {
      activeSeason = -1;
      drawSeasonIndicator(contentWidth, contentHeight)
      drawEvents(eventData, typeData);
      updateNarrative(eventData, typeData);
    });
};

var updateListeners = function (eventData, typeData) {
  var content = d3.selectAll('.listeners');
  var seasons = content.selectAll('.season-listener').data([]);
  seasons.remove();
  addListeners(eventData, typeData);
};

var getContentWidth = function () {
  var contentWidth = window.innerWidth - legendWidth - margin.left - margin.right;
  return contentWidth;
};

var drawEvents = function (eventData, typeData) {
  var content = d3.select('.content');
  var nested = getNested(eventData);
  var x = getX();
  var xx = x(start + activeSeason/4.0) + (x(start + 0.25)-x(start))/2.0;
  var contentWidth = getContentWidth();
  // Create a group for each type
  types = content.selectAll('.event-type').data(nested, function (d) { return d['key']; })
  types.enter()
    .append('g').classed('event-type', true)
  types
    .attr('transform', function(d) { return 'translate(0,' + typeData[d["key"]]["offset"] + ')'; });
  var events = types.selectAll('.event').data(function(d) { return d['values']; })
  events.enter().append('rect').classed('event', true)
  events
    .attr('x', function(d) { return x(d["start"]) + 1; })
    .attr('width', function(d) { return x(d["end"]) - x(d["start"]) - 2; })
    .attr('y', function(d) {
      var start = Math.floor(typeData[d["type"]]["height"]/2
        - (typeData[d["type"]]["max"] - typeData[d["type"]]["min"])*eventHeight/2) + 1;
      return start + (d["position"] - typeData[d["type"]]["min"])*eventHeight;
    })
    .attr('height', eventHeight - 2)
    .attr('rx', rx)
    .attr('fill', function (d) { return eventActive(d) ? '#79bedb' : '#6b78b4'; })
  var eventTextBg = types.selectAll('.event-text-bg').data(function(d) { return d['values']; })
  eventTextBg.enter().append('text').classed('event-text-bg', true)
  eventTextBg
    .text(function (d) { return d["name"]; })
    .attr('fill', '#696969')
    .attr('stroke', '#696969')
    .attr('stroke-width', '3.5')
    .attr('font-size', 0.75*eventHeight)
    .attr('dy', 0.65*eventHeight + 0.5)
    .attr('dx', 0.5)
    .attr('x', xx)
    .attr('y', function(d) {
      var start = Math.floor(typeData[d["type"]]["height"]/2
        - (typeData[d["type"]]["max"] - typeData[d["type"]]["min"])*eventHeight/2) + 1;
      return start + (d["position"] - typeData[d["type"]]["min"])*eventHeight;
    })
    .attr('opacity', function (d) { return eventActive(d) ? '0.8' : '0'; })
    .attr('text-anchor', (xx > contentWidth / 2.0) ? 'end' : 'start');
  var eventText = types.selectAll('.event-text').data(function(d) { return d['values']; })
  eventText.enter().append('text').classed('event-text', true)
  eventText
    .text(function (d) { return d["name"]; })
    .attr('fill', '#fff')
    .attr('font-size', 0.75*eventHeight)
    .attr('dy', 0.65*eventHeight)
    .attr('x', xx)
    .attr('y', function(d) {
      var start = Math.floor(typeData[d["type"]]["height"]/2
        - (typeData[d["type"]]["max"] - typeData[d["type"]]["min"])*eventHeight/2) + 1;
      return start + (d["position"] - typeData[d["type"]]["min"])*eventHeight;
    })
    .attr('opacity', function (d) { return eventActive(d) ? '1' : '0'; })
    .attr('text-anchor', (xx > contentWidth / 2.0) ? 'end' : 'start');
};

var eventActive = function (d) {
  x = getX();
  x.range([0, (end-start)*4])
  var eventSeasons = getEventSeasons();
  if (eventSeasons[d['uid']][activeSeason]) {
    return true;
  }
  return false;
}

var getNested = function (eventData) {
  var nest = d3.nest().key(function (d) { return d["type"]; });
  var nested = nest.entries(eventData);
  return nested;
}

var getEventSeasons = function (eventData) {
  if (typeof(getEventSeasons.eventSeasons) !== 'undefined') {
    return getEventSeasons.eventSeasons;
  }
  getEventSeasons.eventSeasons = {};
  var scale = d3.scale.linear();
  scale.domain([start, end]);
  scale.range([0, Math.round(end-start)*4])
  var seasons = Math.round((end - start)*4);
  for (var i = 0; i < eventData.length; i++) {
    event = eventData[i];
    var s = Math.ceil(scale(event['start']) - 0.5);
    var e = Math.floor(scale(event['end']) + 0.5);
    getEventSeasons.eventSeasons[event['uid']] = {};
    for (var j = s; j < e; j++) {
      getEventSeasons.eventSeasons[event['uid']][j] = true;
    }
  }
  return getEventSeasons.eventSeasons;
}

var update = function (eventData, typeData) {
  draw(eventData, typeData);
  updateNarrative(eventData, typeData);
};

var draw = function (eventData, typeData) {
  var contentWidth = getContentWidth();
  var contentHeight = getContentHeight(typeData);
  var svgWidth = window.innerWidth;
  var svgHeight = contentHeight + margin.top + margin.bottom;
  var x = getX();
  ticks = Math.round((end - start)*4);
  rx = Math.floor(contentWidth / ticks / 2);
  // Get svg element
  var svg = d3.select('svg');
  svg.attr('width', svgWidth - margin.right).attr('height', svgHeight);
  // Nest data
  var nested = getNested(eventData);
  var legend = svg.select('.legend')
    .attr('transform', 'translate(0,' + margin.top + ')');
  // Create the legend
  drawLegend(legend, typeData);
  // Create content area
  var content = svg.select('.content')
    .attr('transform', 'translate(' + (legendWidth + margin.left) + ',' + margin.top + ')');
  var listeners = svg.select('.listeners')
    .attr('transform', 'translate(' + (legendWidth + margin.left) + ',' + margin.top + ')');
  // Draw the x axes
  var topAxis = svg.select('.top-axis')
    .attr('transform', 'translate(' + margin.left + ')');
  var bottomAxis = svg.select('.bottom-axis')
    .attr('transform', 'translate(' + margin.left + ',' + (contentHeight + margin.top) + ')');
  drawTopAxis(topAxis, contentWidth);
  drawTopAxis(bottomAxis, contentWidth);
  // Draw the background
  drawBackground(contentWidth, height);
  // Create backgrounds for types
  var typeBgs = content.selectAll('.event-type-bg').data(nested, function (d) { return d['key']; });
  typeBgs.enter().append('rect').classed('event-type-bg', true);
  typeBgs
    .attr('x', -legendWidth).attr('y', Math.floor(eventHeight/2))
    .attr('width', contentWidth + legendWidth)
    .attr('height', function(d) { return typeData[d["key"]]["height"]; })
    .attr('fill', '#ffffff')
    .attr('fill-opacity', '0.85')
    .attr('transform', function(d) { return 'translate(0,' + typeData[d["key"]]["offset"] + ')'; });
  drawSeasonIndicator(contentWidth, height);
  drawEvents(eventData, typeData);
};

var updateNarrative = function (eventData, typeData) {
  var narrative = d3.select('#narrative');
  if (activeSeason < 0) {
    narrative.text('Hover or click on the timeline...');
    return;
  }
  var season = ["Winter", "Spring", "Summer", "Fall"][activeSeason % 4];
  var year = (Math.floor(activeSeason/4 + start + 0.12));
  var t = 'In the ' + season + ' of ' + year + '... ';
  var typeEvents;
  for (type in typeData) {
    typeEvents = getTypeEvents(eventData, type);
    t += getEventNarrative(typeEvents, typeData);
  }
  narrative.text(t);
};

var getTypeEvents = function (eventData, type) {
  var typeEvents = [];
  var eventSeasons = getEventSeasons();
  for (var i = 0; i < eventData.length; i++) {
    var event = eventData[i];
    if (event["type"] === type && eventSeasons[event["uid"]][activeSeason]) {
      typeEvents.push(event);
    }
  }
  return typeEvents;
};

var getEventNarrative = function (events, typeData) {
  t = '';
  if (events.length > 0) {
    if (typeData[type]["single"] && events.length === 1) {
      t += typeData[type]["single"] + " ";
      description = getEventDescription(events[0])
      t += getArticle(typeData, type, description);
      t += description;
    } else {
      t += typeData[type]["intro"] + " ";
      var parts = [];
      for (var i = 0; i < events.length; i++) {
        p = ''
        description = getEventDescription(events[i]);
        p += getArticle(typeData, type, description);
        p += description;
        parts.push(p)
      }
      if (events.length > 1) {
        parts[parts.length - 1] = "and " + parts[parts.length - 1];
      }
      if (events.length > 2) {
        t += parts.join(', ');
      } else {
        t += parts.join(' ');
      }
    }
    t += '.  ';
  }
  return t;
}

var getArticle = function (typeData, type, description) {
  article = '';
  if (typeData[type]["article"]) {
    article = typeData[type]["article"] + " ";
  }
  if (article == 'a ' && 'aeiou'.indexOf(description.substring(0,1).toLowerCase()) > -1) {
    article = 'an ';
  }
  return article;
}

var getEventDescription = function (event) {
  if (event["narrative"]) {
    return event["narrative"];
  }
  return event["name"];
};