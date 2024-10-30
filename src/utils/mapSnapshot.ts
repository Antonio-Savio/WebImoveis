import { PropertiesProps } from "../pages/home";
import { QuerySnapshot, DocumentData } from "firebase/firestore";

export function addPropertiesIntoSnapshot(snapshot: QuerySnapshot<DocumentData>){
    const listProperties = [] as PropertiesProps[];

    snapshot.forEach(doc => {
      listProperties.push({
        id: doc.id,
        title: doc.data().title,
        uid: doc.data().uid,
        price: doc.data().price,
        cond: doc.data().cond,
        city: doc.data().city,
        neighborhood: doc.data().neighborhood,
        address: doc.data().address,
        area: doc.data().area,
        modality: doc.data().modality,
        rooms: doc.data().rooms,
        images: doc.data().images,
      });
    });
  
    return listProperties;
}