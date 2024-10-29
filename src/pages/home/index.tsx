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
    // const [roomsFilter, setRoomsFilter] = useState<number | null>(null)
    // const [bathroomsFilter, setBathroomsFilter] = useState<number | null>(null)
    // const [carSpaceFilter, setCarSpaceFilter] = useState<number | null>(null)
    // const [minPrice, setMinPrice] = useState<string | number | null>(null)
    // const [maxPrice, setMaxPrice] = useState<string | number | null>(null)

    useEffect(() => {
      loadPosts();
    }, [])

    function loadPosts(){
      const propertiesRef = collection(db, "imóveis")
      const queryRef = query(propertiesRef, orderBy("created", "desc"))

      getDocs(queryRef)
      .then((snapshot) => {
        const listOfProperties = addPropertiesIntoSnapshot(snapshot)

        setProperties(listOfProperties);
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

      const q = query(collection(db, "imóveis"),
      where("city", ">=", input.toUpperCase()),
      where("city", "<=", input.toUpperCase() + '\uf8ff')
      )

      const querySnapshot = await getDocs(q)

      const listOfProperties = addPropertiesIntoSnapshot(querySnapshot)

      setProperties(listOfProperties);
    }

    // useEffect(() => {
    //   if (roomsFilter === null && bathroomsFilter === null) {
    //     loadPosts()
    //   }
    // }, [roomsFilter, bathroomsFilter])
    
    // async function filterByRooms(roomsNumber: number){
    //   roomsFilter === roomsNumber ? setRoomsFilter(null) : setRoomsFilter(roomsNumber) 

    //   let queryRef;

    //   if (roomsNumber === 3) {
    //     queryRef = query(collection(db, "imóveis"), where("rooms", ">=", 3));
    //   } else {
    //     queryRef = query(collection(db, "imóveis"), where("rooms", "==", roomsNumber));
    //   }

    //   const querySnapshot = await getDocs(queryRef)

    //   const listOfProperties = addPropertiesIntoSnapshot(querySnapshot)

    //   setProperties(listOfProperties);
    // }

    // async function filterByBathrooms(bathroomsNumber: number){
    //   bathroomsFilter === bathroomsNumber ? setBathroomsFilter(null) : setBathroomsFilter(bathroomsNumber)

    //   let queryRef;

    //   if (bathroomsNumber === 3) {
    //     queryRef = query(collection(db, "imóveis"), where("bathrooms", ">=", 3));
    //   } else {
    //     queryRef = query(collection(db, "imóveis"), where("bathrooms", "==", bathroomsNumber));
    //   }

    //   const querySnapshot = await getDocs(queryRef)

    //   const listOfProperties = addPropertiesIntoSnapshot(querySnapshot)

    //   setProperties(listOfProperties);
    // }

    // async function filterByCarSpace(carSpaceNumber: number){
    //   carSpaceFilter === carSpaceNumber ? setCarSpaceFilter(null) : setCarSpaceFilter(carSpaceNumber)

    //   let queryRef;

    //   if (carSpaceNumber === 3) {
    //     queryRef = query(collection(db, "imóveis"), where("parkingSpace", ">=", 3));
    //   } else {
    //     queryRef = query(collection(db, "imóveis"), where("parkingSpace", "==", carSpaceNumber));
    //   }

    //   const querySnapshot = await getDocs(queryRef)

    //   const listOfProperties = addPropertiesIntoSnapshot(querySnapshot)

    //   setProperties(listOfProperties);
    // }

    // async function filterByMinPrice(e: React.ChangeEvent<HTMLInputElement>){
    //   const inputPrice = Number(e.target.value)
    //   setMaxPrice(null)
    //   setMinPrice(inputPrice)

    //   let queryRef;

    //   queryRef = query(collection(db, "imóveis"), where("price", ">=", inputPrice));
      
    //   const querySnapshot = await getDocs(queryRef)

    //   const listOfProperties = addPropertiesIntoSnapshot(querySnapshot)

    //   setProperties(listOfProperties);
    // }

    // async function filterByMaxPrice(e: React.ChangeEvent<HTMLInputElement>){
    //   const inputPrice = Number(e.target.value)
    //   setMinPrice(null)
    //   setMaxPrice(inputPrice)

    //   let queryRef;

    //   queryRef = query(collection(db, "imóveis"), where("price", "<=", inputPrice));
      
    //   const querySnapshot = await getDocs(queryRef)

    //   const listOfProperties = addPropertiesIntoSnapshot(querySnapshot)

    //   setProperties(listOfProperties);
    // }

    // async function filterByModality(e: React.ChangeEvent<HTMLInputElement>){
    //   const value = e.target.value;
      
    //   let queryRef;

    //   queryRef = query(collection(db, "imóveis"), where("modality", "==", value));
      
    //   const querySnapshot = await getDocs(queryRef)

    //   const listOfProperties = addPropertiesIntoSnapshot(querySnapshot)

    //   setProperties(listOfProperties);
    // }


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

        <Filter isFilterOpened={isFilterOpened} loadPosts={loadPosts} setProperties={setProperties} />
        {/* <section className={`w-fit overflow-hidden mx-auto bg-white rounded-lg flex gap-4 justify-center items-center flex-wrap transition-all duration-700 ${isFilterOpened ? "max-h-[400px] opacity-100 p-4 mt-4" : "max-h-0 p-0 mt-0 opacity-0"}`}>
          <div>
            <div>Modalidade</div>

            <div className="flex gap-1 text-main">
              <label>
                <input 
                  type="radio" 
                  name="modalidade"
                  value="rent"
                  onChange={filterByModality}
                  className="mr-1"
                />
                Alugar
              </label>
              <label>
                <input 
                  type="radio" 
                  name="modalidade"
                  value="sale"
                  onChange={filterByModality}
                  className="mr-1"
                />
                Comprar
              </label>
            </div>
          </div>
          
          <div>
            <div>Quartos</div>
            <div className="flex gap-1 text-main">
              <div 
                className={`filter-options ${roomsFilter === 1 ? 'border-2 border-main' : ''}`} 
                onClick={() => filterByRooms(1)}
              >
                1
              </div>
              <div 
                className={`filter-options ${roomsFilter === 2 ? 'border-2 border-main' : ''}`} 
                onClick={() => filterByRooms(2)}
              >
                2
              </div>
              <div 
                className={`filter-options ${roomsFilter === 3 ? 'border-2 border-main' : ''}`} 
                onClick={() => filterByRooms(3)}
              >
                3+
              </div>
            </div>
          </div>

          <div>
            <div>Banheiros</div>
            <div className="flex gap-1 text-main">
              <div
                className={`filter-options ${bathroomsFilter === 1 ? 'border-2 border-main' : ''}`} 
                onClick={() => filterByBathrooms(1)}
              >
                1
              </div>
              <div
                className={`filter-options ${bathroomsFilter === 2 ? 'border-2 border-main' : ''}`} 
                onClick={() => filterByBathrooms(2)}
              >
                2
              </div>
              <div
                className={`filter-options ${bathroomsFilter === 3 ? 'border-2 border-main' : ''}`} 
                onClick={() => filterByBathrooms(3)}
              >3+</div>
            </div>
          </div>

          <div>
            <div>Vagas</div>
            <div className="flex gap-1 text-main">
              <div 
                className={`filter-options ${carSpaceFilter === 1 ? 'border-2 border-main' : ''}`} 
                onClick={() => filterByCarSpace(1)}
              >1</div>
              <div
                className={`filter-options ${carSpaceFilter === 2 ? 'border-2 border-main' : ''}`} 
                onClick={() => filterByCarSpace(2)}
              >2</div>
              <div
                className={`filter-options ${carSpaceFilter === 3 ? 'border-2 border-main' : ''}`} 
                onClick={() => filterByCarSpace(3)}
              >3+</div>
            </div>
          </div>

          <div>
            <div>Preço</div>
            <div className="flex gap-1">
              <div >
                <div>Mínimo</div>
                <div className="relative flex items-center">
                  <span className="absolute ml-2">R$</span>
                  <input 
                    type="number"
                    value={minPrice === null ? '' : minPrice}
                    onChange={ e => filterByMinPrice(e) }
                    min={0}
                    placeholder="Ex: 800"
                    className="filter-options pl-8 w-28 outline-none cursor-auto" 
                  />
                </div>
              </div>
              <div>
                <div>Máximo</div>
                <div className="relative flex items-center">
                  <span className="absolute ml-2">R$</span>
                  <input 
                    type="number"
                    value={maxPrice === null ? '' : maxPrice}
                    onChange={ e => filterByMaxPrice(e) }
                    min={0}
                    placeholder="Ex: 2000"
                    className="filter-options pl-8 w-28 outline-none cursor-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section> */}

        <h1 className="font-bold text-center mt-6 text-2xl mb-4">
          Casas e apartamentos ideais para sua moradia
        </h1>

        {properties.length === 0 ? (
          <p className="text-center text-red-500 mt-8 font-bold text-xl">Nenhum imóvel encontrado!</p>
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