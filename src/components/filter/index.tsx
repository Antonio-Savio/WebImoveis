import { useState, useEffect } from "react"
import {
    collection,
    query,
    getDocs,
    where,
} from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { addPropertiesIntoSnapshot } from "../../utils/mapSnapshot";
import { PropertiesProps } from "../../pages/home";
import { formatToBRLCurrency } from "../../utils/currencyFormat";

interface FilterProps{
    isFilterOpened: boolean;
    loadPosts: () => void;
    setProperties: React.Dispatch<React.SetStateAction<PropertiesProps[]>>;
}

export function Filter({isFilterOpened, loadPosts, setProperties}: FilterProps){
    const [roomsFilter, setRoomsFilter] = useState<number | null>(null)
    const [bathroomsFilter, setBathroomsFilter] = useState<number | null>(null)
    const [carSpaceFilter, setCarSpaceFilter] = useState<number | null>(null)
    const [minPrice, setMinPrice] = useState<string | number | null>(null)
    const [maxPrice, setMaxPrice] = useState<string | number | null>(null)
    const [selectedMode, setSelectedMode] = useState<string | null>(null)

    useEffect(() => {
        if ([roomsFilter, bathroomsFilter, carSpaceFilter, selectedMode, minPrice, maxPrice].every(filter => filter === null)) {
          loadPosts()
        }
      }, [roomsFilter, bathroomsFilter, carSpaceFilter, selectedMode, minPrice, maxPrice])
      
      async function filterByRooms(roomsNumber: number){
        roomsFilter === roomsNumber ? setRoomsFilter(null) : setRoomsFilter(roomsNumber)
        setMaxPrice(null)
        setMinPrice(null)
        setSelectedMode(null)
        setBathroomsFilter(null)
        setCarSpaceFilter(null)
  
        let queryRef;
  
        if (roomsNumber === 3) {
          queryRef = query(collection(db, "imóveis"), where("rooms", ">=", 3));
        } else {
          queryRef = query(collection(db, "imóveis"), where("rooms", "==", roomsNumber));
        }
  
        const querySnapshot = await getDocs(queryRef)
  
        const listOfProperties = addPropertiesIntoSnapshot(querySnapshot)
  
        setProperties(listOfProperties);
      }
  
      async function filterByBathrooms(bathroomsNumber: number){
        bathroomsFilter === bathroomsNumber ? setBathroomsFilter(null) : setBathroomsFilter(bathroomsNumber)
        setMaxPrice(null)
        setMinPrice(null)
        setSelectedMode(null)
        setRoomsFilter(null)
        setCarSpaceFilter(null)
  
        let queryRef;
  
        if (bathroomsNumber === 3) {
          queryRef = query(collection(db, "imóveis"), where("bathrooms", ">=", 3));
        } else {
          queryRef = query(collection(db, "imóveis"), where("bathrooms", "==", bathroomsNumber));
        }
  
        const querySnapshot = await getDocs(queryRef)
  
        const listOfProperties = addPropertiesIntoSnapshot(querySnapshot)
  
        setProperties(listOfProperties);
      }
  
      async function filterByCarSpace(carSpaceNumber: number){
        carSpaceFilter === carSpaceNumber ? setCarSpaceFilter(null) : setCarSpaceFilter(carSpaceNumber)
        setMaxPrice(null)
        setMinPrice(null)
        setSelectedMode(null)
        setRoomsFilter(null)
        setBathroomsFilter(null)
  
        let queryRef;
  
        if (carSpaceNumber === 3) {
          queryRef = query(collection(db, "imóveis"), where("parkingSpace", ">=", 3));
        } else {
          queryRef = query(collection(db, "imóveis"), where("parkingSpace", "==", carSpaceNumber));
        }
  
        const querySnapshot = await getDocs(queryRef)
  
        const listOfProperties = addPropertiesIntoSnapshot(querySnapshot)
  
        setProperties(listOfProperties);
      }
  
      async function filterByMinPrice(e: React.ChangeEvent<HTMLInputElement>){
        const inputPrice = e.target.value;
        setMaxPrice(null)
        setSelectedMode(null)
        setRoomsFilter(null)
        setBathroomsFilter(null)
        setCarSpaceFilter(null)

        const formattedValue = formatToBRLCurrency(inputPrice);
        setMinPrice(formattedValue)
  
        let queryRef;
  
        queryRef = query(collection(db, "imóveis"), where("price", ">=", Number(inputPrice.replace(/\D/g, '')) / 100));
        
        const querySnapshot = await getDocs(queryRef)
  
        const listOfProperties = addPropertiesIntoSnapshot(querySnapshot)
  
        setProperties(listOfProperties);
      }
  
      async function filterByMaxPrice(e: React.ChangeEvent<HTMLInputElement>){
        const inputPrice = e.target.value;
        setMinPrice(null)
        setSelectedMode(null)
        setRoomsFilter(null)
        setBathroomsFilter(null)
        setCarSpaceFilter(null)

        const formattedValue = formatToBRLCurrency(inputPrice);

        setMaxPrice(formattedValue)
  
        let queryRef;
  
        queryRef = query(collection(db, "imóveis"), where("price", "<=", Number(inputPrice.replace(/\D/g, '')) / 100));
        
        const querySnapshot = await getDocs(queryRef)
  
        const listOfProperties = addPropertiesIntoSnapshot(querySnapshot)
  
        setProperties(listOfProperties);
      }

      // useEffect(() => {
      //   setSelectedMode()
      // }, [selectedMode])
  
      async function filterByModality(e: React.ChangeEvent<HTMLInputElement>){
        const value = e.target.value;
        setSelectedMode(value)
        setMaxPrice(null)
        setMinPrice(null)
        setRoomsFilter(null)
        setBathroomsFilter(null)
        setCarSpaceFilter(null)

        console.log(selectedMode);
        
        let queryRef;
  
        queryRef = query(collection(db, "imóveis"), where("modality", "==", value));
        
        const querySnapshot = await getDocs(queryRef)
  
        const listOfProperties = addPropertiesIntoSnapshot(querySnapshot)
  
        setProperties(listOfProperties);
      }

    return(
        <section className={`w-fit overflow-hidden mx-auto bg-white rounded-lg flex gap-4 justify-center items-center flex-wrap transition-all duration-700 ${isFilterOpened ? "max-h-[400px] opacity-100 p-4 mt-4" : "max-h-0 p-0 mt-0 opacity-0"}`}>
          <div>
            <div>Modalidade</div>

            <div className="flex gap-1 text-main">
              <label>
                <input 
                  type="radio" 
                  name="modalidade"
                  value="rent"
                  onChange={filterByModality}
                  checked={selectedMode === "rent"}
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
                  checked={selectedMode === "sale"}
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
                    type="text"
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
                    type="text"
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
        </section>
    )
}