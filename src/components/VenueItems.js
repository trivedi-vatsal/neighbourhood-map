import React, { Component } from 'react';

class VenueItems extends Component {
    render() {
        // Returns Venue Name
        return (
            <li tabIndex="0"
                aria-label={`${this.props.venue.name} $this.props.venue.location.formattedAddress}`}
                onClick={() => this.props.listItemClick(this.props)}
                onKeyPress={() => this.props.listItemClick(this.props)}>
                {this.props.venue.name}
            </li>
        );
    }
}

export default VenueItems;
