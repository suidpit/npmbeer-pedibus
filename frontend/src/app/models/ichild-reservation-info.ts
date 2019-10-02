export interface IChildReservationInfo {
  id: string;  // ChildId
  name: string;
  resid: string;  // Reservation Id
  isPresent: boolean;
  companionWhoInserted: string | null;
}
