export interface IReservation {
    _id : number,
    date : Date,
    lineName : string,
    stopName : string,
    childName : string,
    direction : string,
    tripIndex : number
}