import Coordinate from "./coordinate.interface"

export default interface Driver {
  driver_id: string
  location: Coordinate
}