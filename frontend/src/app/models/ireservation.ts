export interface IReservation {
    _id:string;
    date: string;
    lineName:string;
    stopName:string;
    childName:string;
    direction:string;
    tripIndex:number;
}