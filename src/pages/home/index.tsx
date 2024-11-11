import { useState, useEffect } from "react"
import { db } from "../../services/firebaseConnection"
import {
  collection,
  query,
  getDocs,
  orderBy,
  where,
} from "firebase/firestore"
import { Link } from "react-router-dom"
import { TbRulerMeasure } from "react-icons/tb";
import { FaBed, FaFilter, FaSearch } from "react-icons/fa";
import { AiOutlineLoading } from "react-icons/ai";
import { RxDividerVertical } from "react-icons/rx";
import { capitalizeText } from '../../utils/capitalize'
import { addPropertiesIntoSnapshot } from "../../utils/mapSnapshot";
import { Filter } from "../../components/filter";

export interface PropertiesProps{
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


export function Home() {
    const [properties, setProperties] = useState<PropertiesProps[]>([])
    const [loadImages, setloadImages] = useState<string[]>([])
    const [input, setInput] = useState("")
    const [isFilterOpened, setIsFilterOpened] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      loadPosts();
    }, [])

    function loadPosts(){
      setLoading(true)
      const propertiesRef = collection(db, "imóveis")
      const queryRef = query(propertiesRef, orderBy("created", "desc"))

      getDocs(queryRef)
      .then((snapshot) => {
        const listOfProperties = addPropertiesIntoSnapshot(snapshot)

        setTimeout(() => {
          setProperties(listOfProperties);
          setLoading(false)
        }, 400)
      })
    }

    function handleImageLoad(id: string){
      setloadImages((prevImage) => [...prevImage, id])
    }

    async function handleSearch(){
      if(input === ''){
        loadPosts()
        return
      }

      setProperties([])
      setloadImages([])
      setLoading(true)

      const q = query(collection(db, "imóveis"),
      where("city", ">=", input.toUpperCase()),
      where("city", "<=", input.toUpperCase() + '\uf8ff')
      )

      const querySnapshot = await getDocs(q)

      const listOfProperties = addPropertiesIntoSnapshot(querySnapshot)

      setTimeout(() => {
        setProperties(listOfProperties);
        setLoading(false)
      }, 400)
    }


    return (
      <div className="container">
        <section className='bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2'>
          <input
            placeholder="Pesquise por cidade"  
            className="w-full rounded-lg border-2 h-9 px-3 outline-none"
            value={input}
            onChange={ (e) => setInput(e.target.value) }
          />
          <button
            className="bg-main rounded-lg h-9 px-5 text-white hover:opacity-75 focus:ring focus:ring-violet-300"
            onClick={handleSearch}
          >
            <FaSearch />
          </button>
          <button 
            className="bg-main rounded-lg h-9 px-5 text-white hover:opacity-75 focus:ring focus:ring-violet-300"
            onClick={() => setIsFilterOpened(isFilterOpened === false ? true : false)}
          >
            <FaFilter />
          </button>
        </section>


        <Filter isFilterOpened={isFilterOpened} loadPosts={loadPosts} setProperties={setProperties} city={input} />
        

        <h1 className="font-bold text-center mt-6 text-2xl mb-4">
          Casas e apartamentos ideais para sua moradia
        </h1>

        {properties.length === 0 ? (
          loading ? (
            <div className="flex justify-center mt-8 text-indigo-400">
              <AiOutlineLoading size={35} className="animate-spin" />
            </div>
          ) : (
            <p className="text-center text-red-500 mt-8 font-bold text-xl">
              Nenhum imóvel encontrado!
            </p>
          )
        ) : (
          <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {
              properties.map( property => (
                <Link key={property.id} to={`/imovel/${property.id}`}>
                    <section className="w-full bg-white rounded-lg overflow-hidden">
                      <div
                        className="w-full h-72 rounded-lg bg-slate-300"
                        style={{ display: loadImages.includes(property.id) ? "none" : "block" }}
                      ></div>
                      <div className="overflow-hidden rounded-lg">
                        <img
                          className="w-full h-72 object-cover bg-white rounded-lg hover:scale-105 transition-all"
                          src={property.images[0].url}
                          alt="Imóvel"
                          onLoad={ () => handleImageLoad(property.id) }
                          style={{ display: loadImages.includes(property.id) ? "block" : "none" }}
                        />
                      </div>

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
                </Link>
              ))
            }
          </main>

        )}
      </div>
    )
}