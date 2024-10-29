export interface Comment {
    id: Number;
    doctorId: Number;
    userId: Number;
    comment: String;
  }
  
  export interface State {
    comments: Comment[];
  }