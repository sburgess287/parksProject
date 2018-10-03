'use strict';

const apiKey = '5gf26w8p7AKCj4MS3KycJ5wGyNEFa9M2XpdHCfTt';
const searchUrl = 'https://api.nps.gov/api/v1/parks';

// Maps the key value pairs into url friendly query string
function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        return queryItems.join('&');
}

function displayResults(responseJson){
    console.log('displayResults ran');
    console.log(responseJson)
    $('#results-list').empty();
    
    // for each park object in the items array, add list item
    // to the results list with the full name, description, website url, address
    for (let i = 0; i < responseJson.data.length; i++){
        console.log(responseJson.data[i]);
        $('#results-list').append(
            `<li><h3>${responseJson.data[i].fullName}</h3>
            <p>${responseJson.data[i].url}</p>
            <p>Address: ${responseJson.data[i].addresses[0].line2}</p>
            <p>City: ${responseJson.data[i].addresses[0].city}</p>
            <p>State: ${responseJson.data[i].addresses[0].stateCode}</p>
            <p>Postal Code: ${responseJson.data[i].addresses[0].postalCode}</p>
            <p>${responseJson.data[i].description}
            </li>`
        )
    };
    //display the results section  
    $('#results').removeClass('hidden');
}
function getNationalParksInfo(query, maxResults=10) {
    console.log('getNationalParksInfo ran');
    const params = {
        limit: maxResults,
        q: query,
        fields: 'addresses',
        key: apiKey  
    }

    const queryString = formatQueryParams(params)
    const url = searchUrl + '?' + queryString;
    console.log(queryString);
    console.log(url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });

}

// On form submit, get the value of the form and pass to getNationalParksinfo
function watchForm(){
    $('form').submit(event => {
        event.preventDefault();
        const searchTerm = $('#js-search-term').val();
        const maxResults = $('#js-max-results').val();
        console.log (searchTerm);
        console.log(maxResults);
        getNationalParksInfo(searchTerm, maxResults);

    });
}

$(watchForm);