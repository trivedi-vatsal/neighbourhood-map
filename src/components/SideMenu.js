import React, { Component } from 'react';
import VenueItems from './VenueItems';

class SideMenu extends Component {
    render() {
        return (
            <section id="sideDrawer" aria-label="Venue List">
                <input aria-label="Filter Venues"
                       placeholder="Filter Venues"
                       type="search"
                       className="filter"
                       onChange={e => this.props.searchFilter(e.target.value)}/>
                <ul id="places">
                    {this.props.filterVenues && this.props.filterVenues.map((place, index) => (
                        <VenueItems key={index}{...place}
                                    listItemClick={this.props.listItemClick}/>
                    ))}
                </ul>
            </section>
        );
    }
}

export default SideMenu;

