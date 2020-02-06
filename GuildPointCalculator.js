async function RunCalculator() {

    let guildId = "A015C827-9901-E511-A343-AC162DAE0BED";
    let leaderApiKey = "2ED53589-14D6-F14C-8FAB-AC67320AB4FF6B672C5E-FAAC-4269-9ACD-62AF4A28D4A3"; //requires guild access

    let tokenPointValues = {};

    //ITEM POINT VALUES - item id is inside brackets, point total is the number to the right
    
    //WING 1
    tokenPointValues[77705] = 5; //VG
    tokenPointValues[77751] = 5 //Gorseval
    tokenPointValues[77728] = 5 //Sabetha

    //WING 2
    tokenPointValues[77706] = 5 //Sloth
    tokenPointValues[77679] = 5 //Matt

    //WING 3
    tokenPointValues[78873] = 5 //Escort
    tokenPointValues[78902] = 5 //KC
    tokenPointValues[78942] = 5 //Xera

    //WING 4
    tokenPointValues[80623] = 5 //Cairn
    tokenPointValues[80269] = 5 //MO
    tokenPointValues[80087] = 5 //Samarog
    tokenPointValues[80542] = 5 //Deimos

    //WING 5
    tokenPointValues[85993] = 5 //Desmina
    tokenPointValues[85785] = 5 //Rainbow Road
    tokenPointValues[85800] = 5 //Statues
    tokenPointValues[85633] = 20 //Dhuum

    //WING 6
    tokenPointValues[88543] = 5 //CA
    tokenPointValues[88860] = 10 //Twins
    tokenPointValues[88645] = 20 //Qadim 1

    //WING 7
    tokenPointValues[91270] = 5 //Sabir
    tokenPointValues[91246] = 5 //Adina
    tokenPointValues[91175] = 20 //Qadim 2

    //WORLD BOSSES
    tokenPointValues[77759] = 150 //Shatterer
    tokenPointValues[77734] = 75 //Tequatl
    tokenPointValues[77714] = 400 //Triple Trouble Evolved Jungle Wurm
    tokenPointValues[77773] = 75 //Chak Gerent
    tokenPointValues[77742] = 75 //Mordremoth

    //FRACTALS
    tokenPointValues[79489] = 2 //Fragment of Solid Ocean
    tokenPointValues[79909] = 45 //Chunk of Solid Ocean
    tokenPointValues[79851] = 170 //Block of Solid Ocean
    tokenPointValues[79740] = 100 //Crystal Block of Solid Ocean
    tokenPointValues[79535] = 400 //Norn Holo-Dancer (male)
    tokenPointValues[79571] = 400 //Norn Holo-Dancer (female)

    const sinceParameter = $("#lastLogID").val();

    let upgradeLog = await ReadGuildLog(guildId, leaderApiKey, sinceParameter)

    let memberPointDictionary = CalculatePoints(upgradeLog, tokenPointValues);

    DisplayResults(upgradeLog[0].id, memberPointDictionary);
}

async function ReadGuildLog(guildId, leaderApiKey, sinceParameter) {

    let result = await fetch(`https://api.guildwars2.com/v2/guild/${guildId}/log?access_token=${leaderApiKey}&since=${sinceParameter}`)
        .then((response) => response.json())
        .then(guildLog => {
            let test = [];
            guildLog.forEach(entry => {
                if (entry.type === "upgrade" && entry.action === "completed") {
                    test.push(entry);
                }
            })
            return test;
        })
    return result;

}

function CalculatePoints(upgradeLog, tokenPointValues) {
    let memberPoints = {};
    upgradeLog.forEach(entry => {
        if (tokenPointValues[entry.item_id]) {
            if (!memberPoints[entry.user]) {
                memberPoints[entry.user] = 0;
            }
            memberPoints[entry.user] += tokenPointValues[entry.item_id];
        }
    })
    return memberPoints;
}

function DisplayResults(entry, memberPointDictionary) {

    $("#results").children().remove();

    const results = $("#results");

    results.append($('<div>', {
        id: "mostRecentLogID",
        text: `Most Recent Log: ${entry}`
    }))

    results.append($('<table>', {
        id: "memberPointsGrid"
    }))

    const memberPointsGrid = $("#memberPointsGrid");

    memberPointsGrid.append($('<div>', {
        class: "header",
        text: "Guild Member"
    }));

    memberPointsGrid.append($('<div>', {
        class: "header",
        text: "Points Earned"
    }))

    Object.keys(memberPointDictionary).forEach((key) => {
        memberPointsGrid.append($('<div>', {
            text: `${key}`
        }))
        memberPointsGrid.append($('<div>', {
            text: `${memberPointDictionary[key]}`
        }))
    });

}
