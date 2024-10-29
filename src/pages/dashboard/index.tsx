import { useEffect, useState, useContext } from "react"
import { AuthContext } from "../../contexts/AuthContext"
import { collection, getDocs, where, query, doc, deleteDoc } from "firebase/firestore"
import { ref, deleteObject } from "firebase/storage"
import { db, storage } from '../../services/firebaseConnection'
import { DashboardHeader } from "../../components/panelHeader"
import { FiTrash } from 'react-icons/fi';
import { TbRulerMeasure } from "react-icons/tb";
import { FaBed } from "react-icons/fa";
import { RxDividerVertical } from "react-icons/rx";
import { capitalizeText } from "../../utils/capitalize"

interface PropertiesProps{
  id: string;
  title: string;
  uid: string;
  price: string | number;
  cond?: string | number;
  city: string;
  neighborhood: string;
  address: string;
  area: string | number;
  modality: string;
  rooms: string | number;
  images: PropertiesImagesProps[];
}

interface PropertiesImagesProps{
  name: string;
  uid: string;
  url: string;
}

export function Dashboard() {
    const { user } = useContext(AuthContext)
    const [properties, setProperties] = useState<PropertiesProps[]>([])

    useEffect(() => {

      function loadPosts(){
        if (!user?.uid) return;

        const propertiesRef = collection(db, "imóveis")
        const queryRef = query(propertiesRef, where("uid", "==", user.uid))

        getDocs(queryRef)
        .then((snapshot) => {
          let listProperties = [] as PropertiesProps[]

          snapshot.forEach( doc => {
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
              images: doc.data().images 
            })
          })

          setProperties(listProperties);
        })
      }

      loadPosts();

    }, [user])

    async function handleDelete(realEstate: PropertiesProps){
      const docRef = doc(db, "imóveis", realEstate.id)
      await deleteDoc(docRef)
      
      realEstate.images.map( async (image) => {
        const imagePath = `images/${image.uid}/${image.name}`
        const imageRef = ref(storage, imagePath)
        
        try {
          await deleteObject(imageRef);
          setProperties(properties.filter( property => property.id !== realEstate.id ))
        } catch {
          console.log('Erro ao excluir imagem');
        }
      })
    }

    return (
      <div className="container">
        <DashboardHeader/>
        
        {properties.length === 0 ? (
          <p className="text-center text-red-500 mt-8 font-bold text-xl">Sem imóveis cadastrados</p>
        ) : (
          <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {
              properties.map( property => (
                <section key={property.id} className="w-full relative bg-white rounded-lg overflow-hidden">
                  <button
                    onClick={ () => handleDelete(property) } 
                    className="absolute right-0 bg-red-400 rounded-lg text-white hover:text-red-700 p-2 z-10"
                  >
                    <FiTrash size={22}/>
                  </button>
                  {/* <div
                    className="w-full h-72 rounded-lg bg-slate-300"
                    style={{ display: loadImages.includes(property.id) ? "none" : "block" }}
                  ></div> */}
                  <img
                    className="w-full h-72 object-cover bg-white rounded-lg"
                    src={property.images[0].url}
                    alt="Imóvel"
                    // onLoad={ () => handleImageLoad(property.id) }
                    // style={{ display: loadImages.includes(property.id) ? "block" : "none" }}
                  />

                  <h4 className="font-bold mt-1 mb-2 px-2">
                    {property.title}
                  </h4>

                  <p className="mt-1 mb-2 px-2 text-zinc-700">
                    {capitalizeText(property.address)}
                  </p>

                  <p className="px-2 text-zinc-700 flex gap-2 items-center">
                    <span className="flex items-center gap-1">
                      <TbRulerMeasure /> {property.area} m²
                    </span>
                    <span><RxDividerVertical /></span>
                    <span className="flex items-center gap-1">
                      <FaBed /> {property.rooms} Quarto(s)
                    </span>
                  </p>

                  <p className="mt-1 mb-2 px-2">
                    <span className="font-medium mr-1">{property.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    {property.modality === 'rent' && (
                      <span className="text-xs">/mês</span>
                    )}
                  </p>

                  <p className="mt-1 mb-4 px-2 text-zinc-700">
                    {capitalizeText(property.neighborhood)} - {capitalizeText(property.city)}
                  </p>
                </section>
              ))
            }
          </main>
        )}
      </div>
    )
}