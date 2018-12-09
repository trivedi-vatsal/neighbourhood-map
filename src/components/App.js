import React, { Component } from "react";
import "../App.css";
import Map from "./Map";
import axios from "axios";
import SideMenu from "./SideMenu";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            venues: [],
            filterVenues: [],
            sidebar: true,
            markers: []
        };

        this.sidebarToggle = this.sidebarToggle.bind(this);
        this.searchFilter = this.searchFilter.bind(this);
    }

    componentDidMount() {
        this.getVenues();
    }

    initMap = () => {
        let options = {
            zoom: 14,
            center: { lat: 23.215635, lng: 72.63694 }
        };

        const map = new window.google.maps.Map(document.getElementById("map"), options);

        if (map.error) {
            console.log(map.error);
            alert("Error in map:", map.error);
        }

        let infowindow = new window.google.maps.InfoWindow();

        this.state.venues.forEach(myVenue => {
            let marker = new window.google.maps.Marker({
                position: {
                    lat: myVenue.venue.location.lat,
                    lng: myVenue.venue.location.lng
                },
                map: map,
                animation: window.google.maps.Animation.DROP,
                id: myVenue.venue.id,
                icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            });

            let contentString = `<p class="venue-name">${myVenue.venue.name}</p>
         <p class="address">${myVenue.venue.location.formattedAddress[0]}<br/>
         ${myVenue.venue.location.formattedAddress[1]}</p>`;

            marker.addListener("click", () => {
                marker.setAnimation(window.google.maps.Animation.DROP);
                window.setTimeout(() => marker.setAnimation(null), 1500);
                map.setCenter(marker.position);
                infowindow.setContent(contentString);
                infowindow.open(map, marker);
            });
            this.state.markers.push(marker);
        });
    };

    renderMap = () => {
        const apiKey = "AIzaSyDrkjUBAZWuTNaMSzEJmXT01HzGGwhduaw";
        let url = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
        scriptLoader(url);
        window.initMap = this.initMap;
    };

    getVenues = () => {
        const endPoint = "https://api.foursquare.com/v2/venues/explore?";
        const parameters = {
            client_id: "PVMYLE0Z2ILRMZHUHK5OFZ23SZG4XPNTGWIHZUFTTP30OB0U",
            client_secret: "LD3QROPT3BHISCXB01ZTLMW0TQRXE00KUQ5JCL3FPUAFWMPW",
            query: "food",
            near: "Gandhinagar",
            v: "20181610"
        };

        axios
            .get(endPoint + new URLSearchParams(parameters))
            .then(response => {
                this.setState(
                    {
                        venues: response.data.response.groups[0].items,
                        filterVenues: response.data.response.groups[0].items
                    },
                    this.renderMap()
                );
            })
            .catch(error => {
                console.log("ERROR: " + error);
                alert("Foursquare API failed to load.", error);
            });
    };

    sidebarToggle = () => {
        this.setState(state => ({
            sidebar: !state.sidebar
        }));
        let sideDrawer = document.getElementById("sideDrawer");
        if (this.state.sidebar) {
            sideDrawer.classList.add("hide");
        } else {
            sideDrawer.classList.remove("hide");
        }
    };

    listItemClick = place => {
        const marker = this.state.markers.find(marker => marker.id === place.venue.id);
        window.google.maps.event.trigger(marker, "click");
    };

    searchFilter = querySearch => {
        if (querySearch) {
            const venues = this.state.venues.filter(myVenue =>
                myVenue.venue.name.toLowerCase().includes(querySearch)
            );
            this.setState({ filterVenues: venues });
            const markers = this.state.venues.map(venue => {
                const watchedFor = venue.venue.name.toLowerCase().includes(querySearch);
                const marker = this.state.markers.find(marker => marker.id === venue.venue.id);
                if (watchedFor) {
                    marker.setVisible(true);
                } else {
                    marker.setVisible(false);
                }
                return marker;
            });
            this.setState({ markers });
        } else {
            this.setState({ filterVenues: this.state.venues });
            const reset = this.state.markers.map(marker => {
                marker.setVisible(true);
                return marker;
            });
            this.setState({ markers: reset });
        }
    };

    render() {
        return (
            <div className="container">
                <header>
                    <nav>
                        <button id="hamburger-menu" onClick={this.sidebarToggle}>
                            <i className="fas fa-bars fa-2x" />
                        </button>
                        <h2 id="title">Neighborhood Map</h2>
                    </nav>
                </header>
                <main>
                    <SideMenu
                        {...this.state}
                        listItemClick={this.listItemClick}
                        searchFilter={this.searchFilter}
                        filterList={this.filterList}
                    />
                    <Map />
                </main>
            </div>
        );
    }
}

function scriptLoader(url) {
    const index = window.document.getElementsByTagName("script")[0];
    const script = window.document.createElement("script");
    script.onerror = () => {
        window.alert("Google Maps API failed to load.");
    };
    script.src = url;
    script.async = true;
    script.defer = true;
    index.parentNode.insertBefore(script, index);
}

export default App;
