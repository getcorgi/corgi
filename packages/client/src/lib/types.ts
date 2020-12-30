export interface CollectionQueryResult<QueryDocumentData> {
  data: ({ id: string } & QueryDocumentData)[];
  snapshot?: firebase.firestore.QuerySnapshot;
  loading: boolean;
  error?: Error;
  query?: firebase.firestore.Query;
}

export interface DocumentQueryResult<DocumentData> {
  data?: { id: string } & DocumentData;
  snapshot?: firebase.firestore.DocumentSnapshot;
  loading: boolean;
  error?: Error;
}

export enum GroupType {
  Group = 'group',
}
