const ApiKey = "a451b8eca3f2463fb7d79325b30881df";
const baseUrl = "https://api.football-data.org/v2/";
const leagueId = "2000";
const baseEndPoin = `${baseUrl}competitions/${leagueId}`;
const teamEndPoin = `${baseUrl}competitions/${leagueId}/teams`;
const scorerEndPoin = `${baseUrl}competitions/${leagueId}/scorers`;
const matchEndPoin = `${baseUrl}competitions/${leagueId}/matches`;

const contents = document.querySelector("#content-list");
const title = document.querySelector(".card-title");
const fetchHeader = {
    headers: {
        'X-Auth-Token': ApiKey
    }
};

function getListTeams() {
    title.innerHTML = "World Cup Teams"
    fetch(teamEndPoin, fetchHeader)
        .then(response => response.json())
        .then(resJson => {
            console.log(resJson.teams);
            let teams = "";
            resJson.teams.forEach(team => {
                teams += `
                <li class="collection-item avatar">
                    <img src="${team.crestUrl}" alt="" class="circle">
                    <span class="title">${team.name}</span>
                    <p> Color: ${team.clubColors} <br>
                        Founded: ${team.founded} <br>
                        Website: ${team.website} <br>
                        Email: ${team.email} <br>
                        Venue: ${team.venue}
                    </p>
                </li>
                `
            });
            contents.innerHTML = '<ul class="collection">' + teams + '</ul>'
            const detail = document.querySelectorAll('.secondary-content');
            detail.forEach(btn =>{
                btn.onclick=(event) => {
                    loadPage(event.target.dataset.id);
                }
            })
        }).catch(err => {
            console.error(err);
        })
}

function getListScorers() {
    title.innerHTML = "Players Who Score Goals";
    fetch(scorerEndPoin, fetchHeader)
        .then(response => response.json())
        .then(resJson => {
            console.log(resJson.scorers);
            let scors = "";
            let i = 1;
            resJson.scorers.forEach(scorer => {
                scors += `
                <tr>
                    <td style="padding-left:20px;">${i}.</td>
                    <td>${scorer.player.name}</td>
                    <td>${scorer.player.nationality}</td>
                    <td>${scorer.player.position}</td>
                    <td>${scorer.numberOfGoals}</td>
                </tr>
                `;
                i++;

            });
            contents.innerHTML = `
                <div class="card">
                    <table class="stripped responsive-table">
                        <thead>
                            <th></th>
                            <th>Name</th>
                            <th>Nationality</th>
                            <th>Position</th>
                            <th>Goals</th>
                        </thead>
                        <tbody>
                            ${scors}
                        </tbody>
                    </table>
                </div>
            `;
        }).catch(err => {
            console.error(err);
        })
}

function getListMatches() {
    title.innerHTML = "Team Score";
    fetch(matchEndPoin, fetchHeader)
        .then(response => response.json())
        .then(resJson => {
            console.log(resJson.matches);
            let matchs = "";
            let i = 1;
            resJson.matches.forEach(match => {
                let d = new Date(match.utcDate).toLocaleDateString("id");
                let scoreHomeTeam = (match.score.fullTime.homeTeam == null ? 0 : match.score.fullTime.homeTeam);
                let scoreAwayTeam = (match.score.fullTime.awayTeam == null ? 0 : match.score.fullTime.awayTeam);
                matchs += `
                <tr>
                    <td style="padding-left:20px;">${i}.</td>
                    <td>${match.homeTeam.name} vs ${match.awayTeam.name}</td>
                    <td>${d}</td>
                    <td>${match.group}</td>
                    <td>${match.matchday}</td>
                    <td>${scoreHomeTeam}:${scoreAwayTeam}</td>
                </tr>
                `;
                i++;

            });
            contents.innerHTML = `
                <div class="card">
                    <table class="stripped responsive-table">
                        <thead>
                            <th></th>
                            <th>Team</th>
                            <th>Date</th>
                            <th>Group</th>
                            <th>Matchday</th>
                            <th>Final Score</th>
                        </thead>
                        <tbody>
                            ${matchs}
                        </tbody>
                    </table>
                </div>
            `;
        }).catch(err => {
            console.error(err);
        })
}

function loadPage(page) {
    switch (page) {
        case "teams":
            getListTeams();
            break;
        case "scorers":
            getListScorers();
            break;
        case "matches":
            getListMatches();
        break;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);

    document.querySelectorAll(".sidenav a, .topnav a").forEach(elm => {
        elm.addEventListener("click", evt => {
            let sideNav = document.querySelector(".sidenav");
            M.Sidenav.getInstance(sideNav).close();
            page = evt.target.getAttribute("href").substr(1);
            loadPage(page);
        })
    })
    var page = window.location.hash.substr(1);
    if (page === "" || page === "!") page = "teams";
    loadPage(page);
});