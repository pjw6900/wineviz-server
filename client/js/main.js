//global variables
let globalData, currData, wineType, currentState, variety, wordCloudButtong, wordCloudG, ScatterplotG, MapG, scatterplotKey, detailState, summaryG, detailFunctions, detailGs;


//strings for all the summaries
let summaries = []; 

//variables for scatterplot
let scatterXScale, scatterXAxis, scatterXAxisG, scatterYScale, scatterYAxis, scatterYAxisG, order, numPoints, sortBy;

//variables for wine and bottle charts. 
let winebottleSVG, bottleG, glassG, redPercent, whitePercent, riesPercent, chardPercent, sauvbPercent, pinotPercent, merlotPercent, cabPercent, wineColors, titleG;

//variables for wordcloud
let numWordArray, currWords;

//variables to store percent data and names
let wineData, GrapeData;



//state object for transitioning between sections of the upper chart
const vizStates = {
    TITLE: 'title',
    BOTTLES: 'bottles',
    GLASSES: 'glasses',
    DETAILS: 'details'
}

//state object for transitioning between the detail graphs (Summary, wordcloud, scatter, map)
const detailStates = {
    SUMMARY: 'summary',
    WORDCLOUD: 'wordcloud',
    SCATTER: 'scatter',
    MAP: 'map'
}

window.onload = function() {

    wineType = '';
    variety = '';
    currentState = vizStates.BOTTLES;
    
  d3.json("wine.csv", function(d){
    return {
      country: d.country,
      description: d.description,
      points: +d.points,
      variety: d.variety,
      price: +d.price,
      winery: d.winery
    };
  }).then(function(data) {
  
      
      detailFunctions = [];
      
      detailFunctions["summary"] = createWineSummary;
      detailFunctions["wordcloud"] = wordCloud;
      detailFunctions["scatter"] = createScatterPlot;
      detailFunctions["map"] = loadWorldJson;
      
      globalData = data;
        
      winebottleSVG = d3.select("#upperchart").attr('width',    1200).attr('height', 1200)
      
      bottleG = winebottleSVG.append('g');
      glassG = winebottleSVG.append('g');
      titleG = winebottleSVG.append('g');
      
      wineColors = [];
      
      wineColors['White'] = '#f5e0b0';
      wineColors['Red'] = '#7f2b3d';
      
     numWordArray = [{num: 5}, {num: 10}, {num: 15}, {num: 20}]
      
      calculatePercents();
      loadSummaries();
      createTitleScreen();
 
      ScatterplotG = winebottleSVG.append('g')
      
      detailState = detailStates.SUMMARY;
      
      document.querySelector('body').addEventListener('contextmenu', handleBackClick)
      
     
  })
    
}

//function to create the starting title scree
function createTitleScreen(){
    titleG.attr('opacity', 0)
    
    titleG.append('text')
        .attr('x', 600)
        .attr('y', 300)
        .attr('text-anchor', 'middle')
        .style('font-size', '200px')
        .attr('fill', "#292825")
        .text('Wine')
    
     titleG.append('text')
        .attr('x', 600)
        .attr('y', 350)
        .attr('text-anchor', 'middle')
        .style('font-size', '50px')
        .attr('fill', "#292825")
        .text('A visualization by Paul Wilson')
    
    titleG.append('rect')
        .attr('x', 525)
        .attr('y', 400)
        .attr('height', 75)
        .attr('width', 150)
        .attr('fill', "#292825")
        .attr('rx', 10)
        .attr('ry', 10)
        .on('click', handleAbout)
    
     titleG.append('rect')
        .attr('x', 525)
        .attr('y', 505)
        .attr('height', 75)
        .attr('width', 150)
        .attr('fill', "#292825")
        .attr('rx', 10)
        .attr('ry', 10)
        .on('click', handleStart)
    
     titleG.append('text')
        .attr('x', 600)
        .attr('y', 455)
        .attr('text-anchor', 'middle')
        .style('font-size', '50px')
        .attr('fill', "oldlace")
        .text('About')
        .on('click', handleAbout)
    
     titleG.append('text')
        .attr('x', 600)
        .attr('y', 560)
        .attr('text-anchor', 'middle')
        .style('font-size', '50px')
        .attr('fill', "oldlace")
        .text('Start')
        .on('click', handleStart)
    
    titleG.transition()
        .duration(500)
        .delay(500)
        .attr('opacity')
}

//function to handle clicks on the "About" button on title screen
function handleAbout(){
    titleG.attr('opacity', 1)
    titleG
        .transition()
        .duration(500)
        .attr('opacity', 0)
    let aboutg = winebottleSVG.append('g').classed('about', true).attr('opacity', 0)
    
    aboutg.append('text')
        .attr('x', 600)
        .attr('y', 300)
        .attr('text-anchor', 'middle')
        .style('font-size', '200px')
        .attr('fill', "#292825")
        .text('About')
    
    aboutg.append('text')
        .attr('x', 600)
        .attr('y', 330)
        .attr('text-anchor', 'middle')
        .style('font-size', '30px')
        .attr('fill', "#292825")
        .text(summaries['about'])
        .call(wrap, 1000)
        .on('click', handleStart)
    aboutg.append('rect')
        .attr('x', 525)
        .attr('y', 600)
        .attr('height', 75)
        .attr('width', 150)
        .attr('fill', "#292825")
        .attr('rx', 10)
        .attr('ry', 10)
        .on('click', handleAboutBack)
          
    aboutg.append('text')
        .attr('x', 600)
        .attr('y', 655)
        .attr('text-anchor', 'middle')
        .style('font-size', '50')
        .attr('fill', "oldlace")
        .text('Back')
        .on('click', handleAboutBack)
    
    aboutg.transition()
        .delay(500)
        .duration(500)
        .attr('opacity', 500)
}

//function to handle clicks on the "Start" button on title screen
function handleStart(){
    titleG.transition()
        .duration(500)
        .attr('opacity', 0)
        .remove();
    createBottleChart()
    currentState = vizStates.BOTTLES;
}

//function to handle button click on the about menu to transition back to start menu
function handleAboutBack(){
    d3.select('.about')
        .transition()
        .duration(500)
        .attr('opacity', 0)
        .remove()
    
    titleG.transition()
        .duration(500)
        .delay(600)
        .attr('opacity', 1)
}

//function that creates the nav buttons when the detail graphs are displayed
function createNavButtons(){
    let nav = winebottleSVG.append('g').classed('nav', true).attr('transform', 'translate(1500, 0)')
    
    nav.append('image')
        .attr('x', 1000)
        .attr('y', 700)
        .attr('height', 100)
        .attr('width', 100)
        .attr('xlink:href', './Images/buttons/back.png')
        .on('click', handleNavBackward)
    
    nav.append('image')
        .attr('x', 1100)
        .attr('y', 700)
        .attr('height', 100)
        .attr('width', 100)
        .attr('xlink:href', './Images/buttons/forward.png')
        .on('click', handleNavForward)
    
    nav.transition("nav")
        .duration(1000)
        .attr('transform', 'translate(0, 0)')
}

//removes the navigationm buttons when leaving the detail graphs to go back to the glass chart
function removeNavButtons(){
    d3.select(".nav").transition("nav")
        .duration(1000)
        .attr('transform', 'translate(1500, 0)')
        .remove();
}

//function that handles clicks on the forward nav button
function handleNavForward(){
    switch(detailState){
        case 'summary':
           detailState = detailStates.WORDCLOUD;
           moveForward(summaryG, wordCloudG);
           break;
        case 'wordcloud':
           detailState = detailStates.SCATTER;
           moveForward(wordCloudG, ScatterplotG);
           break;
        case 'scatter':
           detailState = detailStates.MAP;
           moveForward(ScatterplotG, MapG);
           break;
    } 
}

//function to handle clicks on the backward nav button
function handleNavBackward(){
    switch(detailState){
        case 'wordcloud':
           detailState = detailStates.SUMMARY;
           moveBackward(wordCloudG, summaryG);
           break;
        case 'scatter':
           detailState = detailStates.WORDCLOUD;
           moveBackward(ScatterplotG, wordCloudG);
           break;
        case 'map':
           detailState = detailStates.SCATTER;
           moveBackward(MapG, ScatterplotG);
           break;
    } 
}

//helper function to move from current detail graph to the next one
function moveForward(oldG, newG){
    oldG
        .transition('moveout')
        .duration(1000)
        .attr('transform', 'translate(-1500, 0)')

    newG.attr('transform', 'translate(1500, 0)')
      
    newG.transition('movein')
    .duration(1000)
    .attr('transform', ('translate(0, 0)'))

    oldG.attr('transform', 'translate(0, 0)')
}

//helper function to move from current detail graph to the previous one
function moveBackward(oldG, newG){
     oldG
        .transition('moveout')
        .duration(1000)
        .attr('transform', 'translate(1500, 0)')
    newG.attr('transform', 'translate(-1500, 0)')
     
    newG.transition('movein')
    .duration(1000)
    .attr('transform', ('translate(0, 0)'))

    oldG.attr('transform', 'translate(0, 0)')
}

//function to create the first detail chart
function createWineSummary(){
    summaryG.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 1200)
        .attr('height', 800)
        .attr('fill', "oldlace")
        .attr('rx', 10)
        .attr('ry', 10)
    
    summaryG.append('text')
        .attr('x', 100)
        .attr('y', 500)
        .attr('fill', "#292825")
        .attr('font-size', '30px')
        .text(summaries[variety])
        .call(wrap, 1000)
    
    summaryG.append('rect')
        .attr('x', 160)
        .attr('y', 150)
        .attr('height', 300)
        .attr('width', 185)
        .attr('fill', wineColors[wineType])
    
    summaryG.append("image")
            .attr('xlink:href', d => './Images/glasses/whitebackground/' + variety + ".png")
            .attr('x', 50)
            .attr('y', 50)
            .attr('height', (d, i) => 400)
            .attr('width', 400)  
            .style('opacity', 1)
    
    summaryG.append('text')
        .attr('x', 350)
        .attr('y', 450)
        .attr('fill', "#292825")
        .attr('text-anchor', 'left')
        .attr('font-size', '130px')
        .text(variety)
    
}

//function to set the values for all the needed summaries in the visualization. 
function loadSummaries(){
    
    summaries['about'] = `Wine is, in essence, fermented grape juice. As easy as it is to reduce things to such simple terms, doing so entirely removes the capacity to understand the sheer depth of history, technique, and enjoyment that a good wine provides. 

    The dataset used to create this certainly doesn't encapsulate the entirety of what wine is. For instance, while the raw dataset itself includes over 130,000 wines and hundreds of varieties of grapes, that was simply too much data to visualize. I chose instead to represent the six most popular grapes grown around the world, known in the wine world as the "Six Noble Grapes". Even only using these select six, there were over 40,000 wines to analyze and visualize.`

     summaries['bottles'] = `There are two main types of wine: Red and White. Generally red wine has been more popular than white, both in consumption and pop culture, but the numbers produced are rather similar. The bottles above are sized proportionally to how much of each is produced, but as you can see, they are rather close. 

        There are many aspects that makes up a good wine that you will see mentioned very commonly in the descriptions of each wine as well as some later visualizations. These include: Acidity, Sugar, Tannins, and Alcohol. All four of these taken into consideration make up the 'balance' of the wine, which is the defining feature of a more premium wine compared to a lesser quality one. There are certain features that are valued more in red wine than in white, and vice versa. Click on a bottle for more details about that type of wine! Right click to go back to title screen.`
      
      summaries['White'] = `The three Noble White Grapes are: Riesling, Chardonnay, and Sauvignon Blanc. In general, white wine is much lighter in body than red wine because it lacks Tannins, which also gives white wine is characteristic shade. Most white wines are made Dry, meaning they lack sugar. There are some noticeable exceptions however, and there are some world-class sweet whites made as well. White wine is often considered more "fresh" and "crisp" than red, which makes it popular in cooking and drinking between meals. Click on a glass to see more details about that variety! Right click to see the bottles again!`;
      
      summaries['Red'] = "The three Noble Red Grapes are: Pinot Noir, Merlot. Generally red wine is heavier in mouthfeel than white because it has tannins in it. If you've ever had red wine before, that gritty, mouth-drying aspect of the wine is from the tannins. Tannins come from the stem and skin of the grape, which also gives red wine its color. Most red wines are dry, and generally less sweets are made than sweet whites. Red wine is more often paired with food or snacks and cooks very well with meats like lamb and beef. Click on a glass to see more details about that variety! Right click to see the bottles again! And after you click a glass, right click to return to this page!";
      
      summaries['Riesling'] = "Riesling originated in the Rhine region of Germany. It is an extremely aromatic grape displaying anything from heavy herbal notes, to mineral and floral. It has characteristically high acid, which makes it one of the more refreshing noble grapes. Riesling is grown all over the world, notable producers are Germany, the USA (New York and Oregon mainly), and the Alsace region of France. It is very expressive of the region it is grown in, so the taste of a German riesling will be quite different than a New York.  ";
      
      summaries['Chardonnay'] = "Chardonnay originated in the Burgundy region of France, which is still widely regarded as the premier region for it. It is grown basically everywhere since it is rather easy to care for, and as such has an extraordinary variety of styles and taste. French Chardonnay, or Chablis, is remarkably fresh and crisp, while those from California are often aged in oak barrels to make the wine more heavy-bodied. It is also very commonly used to make sparkling wine.";
      
      summaries['Sauvignon Blanc'] = "Sauvignon Blanc originated in the Bordeaux region of France, but today New Zealand is famous for the wines they produce with this variety. It is not a wine that ages well and is generally always drank young, so styles like New Zealand’s which accentuate powerful fruity, grassy and herbal or floral flavors have taken the world by storm. It can vary in style and taste depending on the climate in which it grows, but possesses high acidity which tends to carry a high level of freshness to it. ";
      
      summaries['Pinot Noir'] = `Pinot Noir is from the Burgundy region of France, which along with California are the more popular regions for it. Pinot is a notoriously difficult grape to grow for a multitude of reasons and only in fairly recent years has been grown in the new world. It is also difficult to age, and tends to be unpredictable in how it does so, and the characteristic tastes of young and old Pinot Noir wines are exceptionally different. It is very commonly used in sparkling wines.`;

      summaries['Merlot'] = "Merlot is the most common grape in the Bordeaux region of France, but its ease of growing has meant it spread across the globe. It has very distinct styles between the old and new world, where the the former values the medium-body, acidity, and red fruit flavors, the latter values the potential high alcohol, heavier body and lush plum and blackberry flavors. It is also a very popular grape used in red blends.";
      
      summaries['Cabernet Sauvignon'] = "Cabernet Sauvignon originated in the Bordeaux region of France but is grown throughout the world and is one of the most common red varieties. The high levels of acid and tannin in it produce full-bodied wines that age exceptionally well. Its flavor tends to be rather consistent throughout the world, relying more on the winemakers choice and style than a grape like Riesling.";
}

//function that creates the bottle chart
function createBottleChart(){
    
    let yScale = d3.scaleLinear()
        .domain([0, 1])
        .range([100, 0])
    
    let xScale = d3.scaleLinear()
        .domain([0, 1])
        .range([200, 300])
    
    bottleG.selectAll('image')
        .data(wineData)
        .enter()
        .append('svg:image')
        .attr('xlink:href', d => './Images/bottles/' + d.wine + ".png")
        .attr('x', (d, i) => 300 +  (200 * i))
        .attr('y', (d, i) => yScale(d.value))
        .attr('height', (d, i) => 500 - yScale(d.value))
        .attr('width', (d, i) => xScale(d.value))
        .on('click', handleBottleClick)
        .attr('opacity', 0)
        .transition()
        .duration(500)
        .delay(500)
        .attr('opacity', 1)
    
    bottleG.selectAll('text')
        .data(wineData)
        .enter()
        .append('text')
        .attr('x', (d, i) => 420 +  (200 * i))
        .attr('y', 550)
        .attr('text-anchor', 'middle')
        .attr('opacity', 0)
        .text(d => d.wine)
        .style('font-size', "30px")
        .transition()
            .duration(500)
            .delay(500)
            .attr('opacity', 1);;
    
    bottleG.selectAll('.percent')
        .data(wineData)
        .enter()
        .append('text')
        .attr('x', (d, i) => 425 +  (200 * i))
        .attr('y', 600)
        .attr('text-anchor', 'middle')
        .attr('opacity', 0)
        .text(d => Math.round(d.value * 100) + "%")
        .style('font-size', "30px")
        .transition()
        .duration(500)
        .delay(500)
        .attr('opacity', 1);
    
    bottleG.append('text')
        .attr('x', 100)
        .attr('y', 650)
        .attr('fill', "#292825")
        .attr('font-size', '30')
        .text(summaries['bottles'])
        .attr('opacity', 0)
        .call(wrap, 1000)
        .transition()
        .delay(1000)
        .duration(500)
        .attr('opacity', 1)
    
}

//function that creates the glass chart based on the selected bottle
function createGlassChart(){
    
    glassG.selectAll("*").remove()
    
    let yScale = d3.scaleLinear()
        .domain([0, 1])
        .range([300, 100])
    
    let xScale = d3.scaleBand()
        .domain([0, 1, 2])
        .range([100, 1100])
    
    glassG.selectAll('rect')
            .data(GrapeData[wineType])
            .enter()
            .append('rect')
            .attr('x', (d, i) => xScale(i) + 75)
            .attr('y', (d, i) => 400)
            .attr('height', 0)
            .attr('width', 185)
            .style('fill', wineColors[wineType])
            .on('click', handleGlassClick)
            .transition()
            .delay(750)
            .duration(2000)
            .attr('y', d => yScale(d.value))
            .attr('height', d => 400 - yScale(d.value))
            
        
    glassG.selectAll('image')
            .data(GrapeData[wineType])
            .enter()
            .append("image")
            .attr('xlink:href', d => './Images/glasses/' + d.grape + ".png")
            .attr('x', (d, i) => xScale(i))
            .attr('y', 100)
            .attr('height', (d, i) => 400)
            .attr('width', xScale.bandwidth())  
            .style('opacity', 0)
            .on('click', handleGlassClick)
            .transition()
            .delay(500)
            .duration(500)
            .style('opacity', 1)
    
     glassG.selectAll('text')
        .data(GrapeData[wineType])
        .enter()
        .append('text')
        .attr('x', (d, i) => xScale(i) + 175)
        .attr('y', 530)
        .attr('text-anchor', 'middle')
        .text(d => d.grape)
        .style('font-size', "30px")
        .attr('opacity', 0)
        .transition()
        .delay(1000)
        .duration(500)
        .attr('opacity', 1);
    
    glassG.selectAll('.percent')
        .data(GrapeData[wineType])
        .enter()
        .append('text')
        .attr('x', (d, i) => xScale(i) + 175)
        .attr('y', 560)
        .attr('text-anchor', 'middle')
        .text(d => Math.round(d.value * 100) + "%")
        .style('font-size', "30px")
        .attr('opacity', 0)
        .transition()
        .delay(1000)
        .duration(500)
        .attr('opacity', 1);;
     
     
      glassG.append('text')
        .attr('x', 100)
        .attr('y', 600)
        .attr('fill', "#292825")
        .attr('font-size', '30')
        .text(summaries[wineType])
        .attr('opacity', 0)
        .call(wrap, 1000)
        .transition()
        .delay(1500)
        .duration(500)
        .attr('opacity', 1)
        
}

//function that creates the detail charts for the selected variety of wine. Called when a glass is clicked
function makeDetailGs(){
      summaryG = d3.select("#upperchart").append("g");
      
      wordCloudG = d3.select("#upperchart").append("g").attr('width', 1200).attr('height', 620) .attr('transform', 'translate(1500, 0)');  
    
      ScatterplotG = d3.select("#upperchart").append('g').attr('width', 1200).attr('height', 800) .attr('transform', 'translate(1500, 0)');

      MapG = d3.select("#upperchart").append('g')
       .attr('width', 1200)
       .attr('height', 800)
       .attr('transform', 'translate(1500, 0)');
       
      detailGs = [];
      detailGs[detailStates.SUMMARY] = summaryG;
      detailGs[detailStates.WORDCLOUD] = wordCloudG;
      detailGs[detailStates.SCATTER] = ScatterplotG;
      detailGs[detailStates.MAP] = MapG;
    
    createWineSummary();
    wordCloud();
    createScatterPlot();
    loadWorldJson();
}

//function that removes all the detail graphs from the SVG, called when moving back from the detail graphs to the class chart.
function removeDetailGs(){
    detailGs[detailStates.SUMMARY].remove();
    detailGs[detailStates.WORDCLOUD].remove();
    detailGs[detailStates.SCATTER].remove();
    detailGs[detailStates.MAP].remove();
    removeNavButtons();
}

//function that handles a bottle being clicked. Sets the wineType variable and updates the current state.
function handleBottleClick(d, i){
    
    currentState = vizStates.GLASSES;
    
    bottleG.selectAll("*")
        .transition()
        .duration(500)
        .delay(500)
        .style('opacity', 0)
        .remove();
    
    wineType = wineData[i].wine;
    
    createGlassChart();
}

//function that handles a glass being clicked. Sets the variety variable and updates the current state.
function handleGlassClick(d, i){
    currentState = vizStates.DETAILS
    detailState = detailStates.SUMMARY
    variety = GrapeData[wineType][i].grape
    currData = globalData.filter(d => d.variety == variety);
    currWords = getWordData(20);
    makeDetailGs();
    
    summaryG.attr('transform', 'translate(1500, 0)')
    summaryG.transition("summary")
        .delay(500)
        .duration(1000) 
        .attr('transform', 'translate(0, 0)')
    createNavButtons(summaryG);
    
    glassG.transition()
        .delay(2000)
        .duration(1)
        .attr('opacity', 0)
}

//function that handles a right click. Moves the graph back a state details=>glass=>bottle=>title
function handleBackClick(e){
    e.preventDefault();
    switch(currentState){       
        case "bottles":
            bottleG.transition()
                .duration(500)
                .style('opacity', 0)
                .remove()        
            bottleG = winebottleSVG.append('g')
            titleG = winebottleSVG.append('g')
            createTitleScreen();
            currentState = vizStates.TITLE;
            break;
        case "glasses":
            glassG.transition()
                .duration(500)
                .style('opacity', 0)
                .remove();
            glassG = winebottleSVG.append('g')
            createBottleChart();
            currentState =  vizStates.BOTTLES
            break;
        case "details":
            currentState =  vizStates.GLASSES
 
            detailGs[detailState].transition()
                .duration(1000)
                .attr('transform', 'translate(1500, 0)')
            glassG.transition()
                .delay(1100)
                .duration(500)
                .attr('opacity', 1)
            setTimeout(removeDetailGs, 1500);
            break;
            
    }
}

//function that is called when data is loaded in. Calcualtes all the percents needed for the glass and bottle charts
function calculatePercents(){
    
    let totalNum = globalData.length;
    let numReisling = globalData.filter(d => d.variety == 'Riesling').length;
    let numChard = globalData.filter(d => d.variety == 'Chardonnay').length;
    let numSauvb = globalData.filter(d => d.variety == 'Sauvignon Blanc').length;
    let numPinot = globalData.filter(d => d.variety == 'Pinot Noir').length;
    let numMerlot = globalData.filter(d => d.variety == 'Merlot').length;
    let numCab = globalData.filter(d => d.variety == 'Cabernet Sauvignon').length;
 
    let numWhite = numReisling + numChard + numSauvb;
    let numRed = numPinot + numMerlot + numCab;
    
    whitePercent = numWhite/totalNum;
    redPercent = numRed/totalNum;
    
    riesPercent = numReisling/numWhite;
    chardPercent = numChard/numWhite;
    sauvbPercent = numSauvb/numWhite;
    
    pinotPercent = numPinot/numRed;
    merlotPercent = numMerlot/numRed;
    cabPercent = numCab/numRed;
    
    wineData = [{wine: "Red", value: redPercent}, {wine: "White", value:whitePercent}];
    
    GrapeData = [];
    
    GrapeData['White'] = [{grape: "Riesling", value: riesPercent}, {grape: "Chardonnay", value:chardPercent}, {grape: "Sauvignon Blanc", value: sauvbPercent}];
    
    GrapeData['Red'] = [{grape: "Pinot Noir", value: pinotPercent}, {grape: "Merlot", value: merlotPercent}, {grape:"Cabernet Sauvignon", value: cabPercent}];
}

//helper function that creates a master string to feed into the nthMostCommon function
function getWordData(num){
    
    let data = globalData.filter(d => d.variety == variety)
    
    let masterString = "";
    
    for(let i = 0; i < data.length; i++){
      masterString += " " + data[i].description;
    }
    return nthMostCommon(masterString.toLocaleLowerCase(), num)
}

//function that calculates the top num(input value) words used to describe a wine. Also filters out words like a, its, is, of, etc. Code taken from https://stackoverflow.com/questions/6565333/using-javascript-to-find-most-common-words-in-string
function nthMostCommon(string, ammount) {
    var wordsArray = string.split(/\s/);
    
    wordsArray = wordsArray.filter(word => !(word.includes('.')));
    wordsArray = wordsArray.filter(word => !(word.includes(',')));
    wordsArray = wordsArray.filter(word => !(word.includes('%')));
    wordsArray = wordsArray.filter(word => word != "and");
    wordsArray = wordsArray.filter(word => word != "of");
    wordsArray = wordsArray.filter(word => word != "this");
    wordsArray = wordsArray.filter(word => word != "with");
    wordsArray = wordsArray.filter(word => word != "the");
    wordsArray = wordsArray.filter(word => word != "a");
    wordsArray = wordsArray.filter(word => word != "through");
    wordsArray = wordsArray.filter(word => word != "an");
    wordsArray = wordsArray.filter(word => word != "on");
    wordsArray = wordsArray.filter(word => word != "in");
    wordsArray = wordsArray.filter(word => word != "to");
    wordsArray = wordsArray.filter(word => word != "it's");
    wordsArray = wordsArray.filter(word => word != "the");
    wordsArray = wordsArray.filter(word => word != "is");
    wordsArray = wordsArray.filter(word => word != "palate");
    wordsArray = wordsArray.filter(word => word != "flavors");
    wordsArray = wordsArray.filter(word => word != "but");
    wordsArray = wordsArray.filter(word => word != "that");
    wordsArray = wordsArray.filter(word => word != "it");
    wordsArray = wordsArray.filter(word => word != "a");
    wordsArray = wordsArray.filter(word => word != "finish");
    wordsArray = wordsArray.filter(word => word != "wine");
    wordsArray = wordsArray.filter(word => word != "notes");
    wordsArray = wordsArray.filter(word => word != "with");
    wordsArray = wordsArray.filter(word => word != "by");
    wordsArray = wordsArray.filter(word => word != "drink");
    wordsArray = wordsArray.filter(word => word != "are");
    wordsArray = wordsArray.filter(word => word != "riesling");
    wordsArray = wordsArray.filter(word => word != "from");
    wordsArray = wordsArray.filter(word => word != "for");
    wordsArray = wordsArray.filter(word => word != "its");
    wordsArray = wordsArray.filter(word => word != "aromas");
    wordsArray = wordsArray.filter(word => word != "nose");
    wordsArray = wordsArray.filter(word => word != "white");
    wordsArray = wordsArray.filter(word => word != "has");
    wordsArray = wordsArray.filter(word => word != "yet");
    wordsArray = wordsArray.filter(word => word != "chardonnay");
    wordsArray = wordsArray.filter(word => word != "red");
    wordsArray = wordsArray.filter(word => word != "as");
    wordsArray = wordsArray.filter(word => word != "merlot");
    wordsArray = wordsArray.filter(word => word != "sauvignon");
    wordsArray = wordsArray.filter(word => word != "blanc");
    wordsArray = wordsArray.filter(word => word != "cabernet");
    wordsArray = wordsArray.filter(word => word != "pinot");
    wordsArray = wordsArray.filter(word => word != "noir");
    wordsArray = wordsArray.filter(word => word != "shows");
    wordsArray = wordsArray.filter(word => word != "while");
    wordsArray = wordsArray.filter(word => word != "more");
    wordsArray = wordsArray.filter(word => word != "good");
    wordsArray = wordsArray.filter(word => word != "at"); 
    wordsArray = wordsArray.filter(word => word != "very");
    wordsArray = wordsArray.filter(word => word != "not");
    wordsArray = wordsArray.filter(word => word != "cab");
    wordsArray = wordsArray.filter(word => word != "bit");
    wordsArray = wordsArray.filter(word => word != "will");
    wordsArray = wordsArray.filter(word => word != "offers");
    wordsArray = wordsArray.filter(word => word != "all");
    wordsArray = wordsArray.filter(word => word != "so");
    wordsArray = wordsArray.filter(word => word != "now");
    wordsArray = wordsArray.filter(word => word != "long");
    wordsArray = wordsArray.filter(word => word != "hints");
    wordsArray = wordsArray.filter(word => word != "some");
    wordsArray = wordsArray.filter(word => word != "just");
    wordsArray = wordsArray.filter(word => word != "well");
    wordsArray = wordsArray.filter(word => word != "touch");
    wordsArray = wordsArray.filter(word => word != "into");
    wordsArray = wordsArray.filter(word => word != "vineyard");
    
    var wordOccurrences = {}
    for (var i = 0; i < wordsArray.length; i++) {
        wordOccurrences['_'+wordsArray[i]] = ( wordOccurrences['_'+wordsArray[i]] || 0 ) + 1;
    }
    var result = Object.keys(wordOccurrences).reduce(function(acc, currentKey) {
     
        for (var i = 0; i < ammount; i++) {
            if (!acc[i]) {
                acc[i] = { word: currentKey.slice(1, currentKey.length), occurences: wordOccurrences[currentKey] };
                break;
            } else if (acc[i].occurences < wordOccurrences[currentKey]) {
                acc.splice(i, 0, { word: currentKey.slice(1, currentKey.length), occurences: wordOccurrences[currentKey] });
                if (acc.length > ammount)
                    acc.pop();
                break;
            }
        }
        return acc;
    }, []);
    
    result.forEach(word => word.word = word.word.charAt(0).toUpperCase() + word.word.slice(1))
    
    return result;
}

//function to create the wordcloud. D3 wordcloud plugin taken from https://github.com/jasondavies/d3-cloud
function wordCloud(dataSet = getWordData(20)){
    let wordScale = d3.scaleLinear()
                        .domain([d3.min(dataSet, d=> d.occurences), d3.max(dataSet, d=> d.occurences)])
                        .rangeRound([30,60]);
    
    let svg = wordCloudG.append("g").attr('transform', 'translate(600, 300)').attr('class', 'cloud');
    
    svg.append('rect')
        .attr('x', -600)
        .attr('y', -300)
        .attr('width', 1200)
        .attr('height', 800)
        .attr('fill', "oldlace")
        .attr('rx', 10)
        .attr('ry', 10)
    
    let colorScale = d3.scaleOrdinal()
        .domain([0, 1, 2, 3, 4])
        .range(["#7f2b3d", "#e3ad8d", "#f6e4bc", "#292825", "#f9f5e5"])
    
    let wordKey = (d) => d.word;

     d3.layout.cloud().size([1000, 600])
            .words(dataSet)
            .rotate(function() {
                var num = Math.floor(Math.random()*45); // this will get a number between 1 and 99;
                num *= Math.floor(Math.random()*2) == 1 ? 1 : -1; // this will add minus sign in 50% of cases
                return 0;
     })
            .padding(5)
            .fontSize(d => wordScale(d.occurences))
            .on("end", draw)
            .start();
 
    function draw(words) {
         var cloud = svg.selectAll("text")
                        .data(words, d => d.word)
   
        cloud.enter()
            .append("text")
            .style("font-family", 'Playfair Display')
            .style("fill", (d, i) => colorScale(3))
            .style("opacity", 0)
            .attr("text-anchor", "middle")
            .attr('font-size', d => wordScale(d.occurences))
            .text(function(d) { return d.word; })

        .merge(cloud)
            .transition('merge')
                .delay(1100)
                .duration(1000)
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .style("opacity", 1);

        cloud.exit()
            .transition('removeunused')
                .duration(200)
                .style('fill-opacity', 0)
                .attr('font-size', 1)
                .remove();    
    }
    

    
        wordCloudG.selectAll('button')
            .data(numWordArray)
            .enter()
            .append('rect')
            .attr('x', (d, i) => 300 + i * 150)
            .attr('y', 745)
            .attr('height', 50)
            .attr('width', 100)
            .attr('fill', colorScale(3))
            .classed('button', true)
            .attr('rx', 10)
            .attr('ry', 10)
            .on('click', updateWordCloud);
    
         wordCloudG.selectAll('buttonlabels')
            .data(numWordArray)
            .enter()
            .append('text')
            .attr('x', (d, i) => 350 + i * 150)
            .attr('y', 780)
            .attr('text-anchor', 'middle')
            .attr('fill', colorScale(4))
            .attr('font-size', '30px')
            .classed('buttonlabel', true)
            .text((d, i) => numWordArray[i].num)

        wordCloudG.append('text')
            .attr('x', 600)
            .attr('y', 735)
            .attr('text-anchor', 'middle')
            .attr('fill', colorScale(3))
            .attr('font-size', "40px")
            .classed('label', true)
            .text("Show me the top X words used to review this variety")
        
}

//function to update the wordcloud when a control button is clicked
function updateWordCloud(d, i){

    let numWords = numWordArray[i].num;
       
    d3.selectAll('.cloud')
        .transition("remove")
        .duration(500)
        .style('opactiy', 0)
        .remove();
    
    d3.selectAll('.button')
        .remove();
    
    d3.selectAll('.buttonlabel')
        .remove();
    wordCloud(currWords.slice(0, numWords));
}

//function to create scatterplot
function createScatterPlot(dataset = currData){
  
scatterplotKey = (d) => d.description;
  
scatterXScale = d3.scaleLinear()
  .domain([d3.min(dataset, (d) => d.points), d3.max(dataset, (d) => d.points)])
  .range([100, 1100]);

scatterYScale = d3.scaleLinear()
  .domain([d3.min(dataset, (d) => d.price), d3.max(dataset, (d) => d.price)])
  .range([550, 50]);
    
ScatterplotG.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 1200)
        .attr('height', 800)
        .attr('fill', "oldlace")
        .attr('rx', 10)
        .attr('ry', 10)

  ScatterplotG
    .selectAll('circle')
    .data(dataset, scatterplotKey)
    .enter()
    .append('circle')
    .attr('r', '4')
    .attr('cx', (d) => scatterXScale(d.points))
    .attr('cy', (d) => scatterYScale(d.price))
    .style('fill', "#292825")
    .classed('datapoint', true)
    .on('mouseover', handleMouseOverScatter)
    .on('mouseout', handleMouseOutScatter);
    
  scatterXAxis = d3.axisBottom()
    .scale(scatterXScale);
  
  scatterXAxisG = ScatterplotG.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0, 560)`)
    .style('font-size', "15px")
    .call(scatterXAxis);
  
  ScatterplotG.append('text')
    .attr("transform", "translate(600, 595)")
    .text("Points (Out of 100)")
    .style("text-anchor", "middle")
    .style("font-size", "20px");
  
  scatterYAxis = d3.axisLeft()
                .scale(scatterYScale);

  scatterYAxisG = ScatterplotG.append('g')
     .attr('class','axis')
     .attr('transform', `translate(90,0)`)
    .style('font-size', "15px")
     .call(scatterYAxis);

  ScatterplotG.append('text')
    .attr("transform", "translate(30, 300) rotate(-90)")
    .text("Price (USD)")
    .style("text-anchor", "middle")
    .style("font-size", "20px");
    
  ScatterplotG.selectAll(".button")
        .data(["Top", "Bottom", 500, 1000, 1500, 2000, "Price", "Points"])
        .enter()
        .append('rect')
            .attr('x', (d, i) => 75 + i * 110)
            .attr('y', 745)
            .attr('height', 50)
            .attr('width', 100)
            .attr('fill', "#292825")
            .classed('button', true)
            .attr('rx', 10)
            .attr('ry', 10)
            .on('click', handleScatterButtonClick);
    
    ScatterplotG.selectAll('buttonlabels')
            .data(["Top", "Bottom", 500, 1000, 1500, 2000, "Price", "Points"])
            .enter()
            .append('text')
            .attr('x', (d, i) => 125 + i * 110)
            .attr('y', 780)
            .attr('text-anchor', 'middle')
            .attr('fill', "#f9f5e5")
            .attr('font-size', '30px')
            .classed('buttonlabel', true)
            .text((d, i) => d)
            .on('click', handleScatterButtonClick)
    
    ScatterplotG.append('text')
        .attr('x', 80)
        .attr('y', 700)
        .attr('font-size', '50px')
        .text("Show me the ___ ____ wines sorted by _____")
    
}

//function to handle when mouse moves over a datapoint in scatterplot. Adds the text below graph
function handleMouseOverScatter(d, i){
     let currCircle = d3.select(this)
        .style('fill', "#f9f5e5")

     let details = ScatterplotG.append('g').classed('details', true)
 
     details.append('text')
        .attr('x', 200)
        .attr('y', 620)
        .attr('text-anchor', 'middle')
        .attr('fill', "#292825")
        .attr('font-size', '25px')
        .classed('buttonlabel', true)
        .text(`Points: ${d.points}`)
     
     details.append('text')
        .attr('x', 400)
        .attr('y', 620)
        .attr('text-anchor', 'middle')
        .attr('fill', "#292825")
        .attr('font-size', '25px')
        .classed('buttonlabel', true)
        .text(`Price: $${d.price}`)
    
     details.append('text')
        .attr('x', 600)
        .attr('y', 620)
        .attr('text-anchor', 'middle')
        .attr('fill', "#292825")
        .attr('font-size', '25px')
        .classed('buttonlabel', true)
        .text(`Country: ${d.country}`)
    
    details.append('text')
        .attr('x', 900)
        .attr('y', 620)
        .attr('text-anchor', 'middle')
        .attr('fill', "#292825")
        .attr('font-size', '25px')
        .classed('buttonlabel', true)
        .text(`Winery: ${d.winery}`)
    
    let description = details.append('text')
        .attr('x', 100)
        .attr('y', 650)
        .attr('fill', "#292825")
        .attr('font-size', '20px')
        .text(d.description)
        .call(wrap, 1000)

}

//function to allow a text-wrapping functionality in svg. Code taken from https://bl.ocks.org/mbostock/7555321
function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0, //parseFloat(text.attr("dy")),
            tspan = text.text(null)
                        .append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("dy", ++lineNumber * lineHeight + dy + "em")
                            .text(word);
            }
        }
    });
}

//function to handle when mouse moves out of a datapoint in scatterplot. Removes text below graph
function handleMouseOutScatter(d, i){
  let currCircle = d3.select(this)
        .style('fill', "#292825")
    
  ScatterplotG.selectAll('.details').remove();
}

//function to handle when a control button is clicked in scatter plot. Updates relevant filter data then 
function handleScatterButtonClick(d, i){
        switch(i){
            case 0:
                order = "top"
                numPoints = numPoints || 2000;
                sortBy = sortBy || "points";
            break;
            case 1:
                order = "bottom"
                numPoints = numPoints || 2000;
                sortBy = sortBy || "points";
            break;
            case 2:
                order = order || "top";
                numPoints = 500;
                sortBy = sortBy || "points";
            break;
            case 3:
                order = order || "top";
                numPoints = 1000;
                sortBy = sortBy || "points";
            break;
            case 4:
                order = order || "top";
                numPoints = 1500;
                sortBy = sortBy || "points";
            break;
            case 5:
                order = order || "top";
                numPoints = 2000;
                sortBy = sortBy || "points";
            break;
            case 6:
                order = order || "top";
                numPoints = numPoints || 2000;
                sortBy = "price";
            break;
            case 7:
                order = order || "top";
                numPoints = numPoints || 2000;
                sortBy = "points";
            break;
        }
    updateChart();
    
}


//function to update scatterplot based on filter options
function updateChart() {
    
  switch(sortBy){
     
    case "points":
      if(order==="top"){
        currData.sort((a,b) => b.points-a.points);
      }
      else{
        currData.sort((a,b) => a.points-b.points);
      }
      break;
    case "price":
      if(order=="top"){
        currData.sort((a,b) => b.price-a.price);
      }
      else{
        currData.sort((a,b) => a.price-b.price);
      }
      break;
  }
  
 let dataToDisplay = currData.slice(0, numPoints-1);
    

  
  scatterXScale.domain([d3.min(dataToDisplay, (d) => d.points), d3.max(dataToDisplay, (d) => d.points)]);
  scatterYScale.domain([d3.min(dataToDisplay, (d) => d.price), d3.max(dataToDisplay, (d) => d.price)]);

  scatterYAxis.scale(scatterYScale)
  scatterYAxisG.transition('yaxis')
    .duration(500)
    .call(scatterYAxis);
  scatterXAxis.scale(scatterXScale)
  scatterXAxisG.transition('xaxis')
    .duration(500)
    .call(scatterXAxis);
  
    
 let circles = ScatterplotG.selectAll('.datapoint').data(dataToDisplay, scatterplotKey);

  circles
    .enter()
    .append('circle')
    .attr('r', '3')
    .attr('cx', 1050)
    .attr('cy', (d) => scatterYScale(d.price))
    .style('fill', "#292825")
    .classed('datapoint', true)
    .on('mouseover', handleMouseOverScatter)
    .on('mouseout', handleMouseOutScatter)
  .merge(circles)
    .transition('circlemerge')
    .duration(500)
    .attr('cx', (d) => scatterXScale(d.points))
    .attr('cy', d => scatterYScale(d.price))
    
  circles.exit()
    .transition('circleexit')
    .duration(500)
    .style('opacity', 0)
    .remove();
}    

//function that draws the map to the screen
function createMap(dataset, worldValues) {

    
  MapG.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 1200)
        .attr('height', 800)
        .attr('fill', "oldlace")
        .attr('rx', 10)
        .attr('ry', 10)
  // 2. Define a map projection
  let projection = d3.geoMercator()
                    .translate([600, 400])
                    .scale([120]);

  let path = d3.geoPath()
            .projection(projection);
							 
  let color = d3.scaleQuantize()     .range(["#f9e2da","#eebdad","#d19a88","#b98270","#8c5746"]);


  let cValues = Array.from(worldValues.values());
  color.domain(d3.extent(cValues));

  MapG.selectAll("path")
      .data(dataset.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("fill", d => {
      
        d.properties.amount = worldValues.get(d.properties.name); 
      
        let value = d.properties.amount;
        if (value) {
          return color(value);
        } else {
          return "#e3dcc4";
        }
      })
        .on('mouseover', handleMouseOverMap)
        .on('mouseout', handleMouseOutMap);
        
    
    d3.select(".nav")
        .remove();
    
    createNavButtons(MapG)
}

//function to add tooltip when mousing over a country on map
function handleMouseOverMap(d){
    let tooltip = MapG.append('g').attr('id', "tooltip");
    
    let mouseX = d3.mouse(this)[0];
    let mouseY = d3.mouse(this)[1]
    
    tooltip.append('rect')
        .attr('x', mouseX)
        .attr('y', mouseY)
        .attr('width', '200px')
        .attr('height', '50px')
        .attr('rx', '10px')
        .attr('ry', '10px')
        .attr('fill', '#292825')
    
    tooltip.append('text')
        .attr('x', mouseX + 20)
        .attr('y', mouseY + 20)
        .attr('fill', 'oldlace')
        .attr('font-size', "20px")
        .text(`Country: ${d.properties.name}`);
    
     tooltip.append('text')
        .attr('x', mouseX + 20)
        .attr('y', mouseY + 40)
        .attr('fill', 'oldlace')
        .attr('font-size', "20px")
        .text(`Number of Wines: ${d.properties.amount}`)
}

//removes tooltip added by the mouseover function when mouse moves out of the country on the map
function handleMouseOutMap(){
    d3.select("#tooltip").remove();
}

//function to load in the json to make the world map
function loadWorldJson(){
    d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson').then((json) => {
  
        let worldvalues =  parseCountryData(currData);

      let countries = json.features.map(d => { 
        return {
          country: d.properties.name, 
          value: (worldvalues[d.properties.name] || 0)
        }
      });

      let countryValues = new Map(countries.map(d => [d.country, d.value]));
      createMap(json, countryValues);
    });
}

//function to parse the country data from the dataset 
function parseCountryData(dataSet){
    let countryData = [];
    
    for(let i = 0; i < dataSet.length; i++){
        countryData[dataSet[i].country] = ( countryData[dataSet[i].country] || 0) + 1;
    }
    
    return countryData;
}
