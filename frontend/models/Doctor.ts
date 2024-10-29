export interface Doctor {
    id: Number;
    name: String;
    rating: Number;
    contact: String;
  }
  
  export interface State {
    doctors: Doctor[];
  }