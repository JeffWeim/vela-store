import { compose, withState, withProps } from 'recompose'
import Map from 'components/Map'
import MapMarker from 'components/MapMarker'
import LocationInfo from 'components/locations/LocationInfo'
import Card from 'components/Card'
import { BackIcon } from 'components/Icons'
import LocationFilter from './LocationFilter';

const LocationsMap = ({ locations, filterLocations, setSelected, selected, setFilter, filter }) =>
  <div className='LocationsMap'>
    <Map onClick={e => e.event.target.nodeName === 'DIV' && setSelected(null)}>
      {locations.map(({ pos, type }, i) =>
        <MapMarker
          lat={pos.lat}
          lng={pos.lng}
          type={type[0]}
          onClick={() => setSelected(i)}
          selected={selected === i}
          disabled={selected !== null && selected !== i}
          hidden={filterLocations && !filterLocations.includes(locations[i])}
        />
      )}
    </Map>
    <div className='filter'>
      <LocationFilter
        onFilterSelect={newFilter => {
          setFilter(filter === newFilter ? null : newFilter)
          setSelected(null)
        }}
        selectedFilter={filter}
      />
    </div>
    { selected !== null &&
      <div className='info'>
        <Card>
          <a onClick={() => setSelected(null)}>
            <BackIcon />
          </a>
          <LocationInfo {...locations[selected]} />
        </Card>
      </div>
    }
    <style jsx>{`
      .LocationsMap {
        height: 100%
      }
      .info {
        position: absolute;
        top: 1rem; left: 1rem; right: 1rem;
        background-color: #f5f5f5;
      }
      .info a {
        position: absolute;
        right: 1rem;
        top: 1rem;
      }
      .filter {
        position: fixed;
        bottom: 1rem; left: 1rem;
        left: 50%;
        transform: translateX(-50%);
      }
      @media only screen and (min-width: 768px) {
        .info {
          max-width: 340px;
        }
      }
    `}</style>
  </div>

export default compose(
  withState('selected', 'setSelected', null),
  withState('filter', 'setFilter', null),
  withProps(
    ({ filter, locations }) => ({
      filterLocations: filter ? locations.filter(({type}) => type.includes(filter)) : null
    })
  )
)(LocationsMap)
