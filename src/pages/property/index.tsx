import { useEffect, useState } from "react"
import { FaWhatsapp } from 'react-icons/fa'
import { FaCarAlt, FaShower, FaBed } from "react-icons/fa";
import { TbRulerMeasure } from "react-icons/tb";
import { useNavigate, useParams } from "react-router-dom"
import { db } from "../../services/firebaseConnection"
import { getDoc, doc } from 'firebase/firestore'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { capitalizeText } from "../../utils/capitalize";

interface PropertyProps{
  id: string;
  title: string;
  uid: string;
  owner: string;
  price: string | number;
  cond?: string | number;
  iptu?: string | number;
  parkingSpace?: string | number;
  city: string;
  neighborhood: string;
  address: string;
  area: string | number;
  modality: string;
  rooms: string | number;
  bathrooms: string | number;
  desc: string;
  tel: string | number;
  created: string;
  images: PropertiesImagesProps[];
}

interface PropertiesImagesProps{
  name: string;
  uid: string;
  url: string;
}

export function PropertyDetail() {
    const { id } = useParams()
    const [property, setProperty] = useState<PropertyProps>()
    const [sliderPreview, setSliderPreview] = useState<number>(2)
    const navigate = useNavigate()

    useEffect(() => {
      async function loadProperty(){
        if (!id) return

        const docRef = doc(db, "imóveis", id)
        getDoc(docRef)
        .then((snapshot) => {
          if(!snapshot.data()){
            navigate("/")
          }

          setProperty({
            id: snapshot.id,
            title: snapshot.data()?.title,
            uid: snapshot.data()?.uid,
            owner: snapshot.data()?.owner,
            price: snapshot.data()?.price,
            cond: snapshot.data()?.cond,
            iptu: snapshot.data()?.iptu,
            parkingSpace: snapshot.data()?.parkingSpace,
            city: snapshot.data()?.city,
            neighborhood: snapshot.data()?.neighborhood,
            address: snapshot.data()?.address,
            area: snapshot.data()?.area,
            modality: snapshot.data()?.modality,
            rooms: snapshot.data()?.rooms,
            bathrooms: snapshot.data()?.bathrooms,
            desc: snapshot.data()?.desc,
            tel: snapshot.data()?.tel,
            created: snapshot.data()?.created,
            images: snapshot.data()?.images,
          })
        })
      }

      loadProperty()
    }, [id])

    useEffect(() => {
      function handleResize(){
        if (window.innerWidth < 720){
          setSliderPreview(1)
        } else{
          setSliderPreview(2)
        }
      }

      handleResize();

      window.addEventListener("resize", handleResize)

      //componente desmonta
      return() => {
        window.removeEventListener("resize", handleResize)
      }
    }, [])

    return (
      <div className="container">
        {property && (
          <Swiper
            slidesPerView={sliderPreview}
            pagination={{ clickable: true }}
            navigation
          >
            {property?.images.map( image => (
              <SwiperSlide key={image.name}>
                <img 
                  src={image.url} 
                  alt="Imagem do imóvel"
                  className="w-full h-96 object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        { property && (
        <main className="w-full bg-white rounded-lg p-6 my-4">
          
          <h2 className="font-bold text-2xl">
            {property.title}
          </h2>

          <p className="my-5">
            {property.desc}
          </p>

          <div className="flex items-center gap-x-8 gap-y-4 flex-wrap my-5">
            <div>
              <div>{property.modality === 'rent' ? "Aluguel" : "Venda"}</div>
              <div className="font-bold text-2xl">{property.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
            </div>
            {property.cond && (
              <div>
                <div>Condomínio</div>
                <div className="font-bold">{property.cond}</div>
              </div>
            )}
            {property.iptu && (
              <div>
                <div>IPTU</div>
                <div className="font-bold">{property.iptu}</div>
              </div>
            )}
          </div>

          <div className="my-5">
            <h2 className="font-bold mb-1">
              Detalhes
            </h2>
            <div className="flex gap-x-8 gap-y-4 flex-wrap">
              <div className="flex items-center gap-3">
                <TbRulerMeasure size={25} />
                <div>
                  <div>Área</div>
                  <div className="font-bold">{property.area} m²</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaBed size={25} />
                <div>
                  <div>Quartos</div>
                  <div className="font-bold">{property.rooms}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaShower size={25} />
                <div>
                  <div>Banheiros</div>
                  <div className="font-bold">{property.bathrooms}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaCarAlt size={25} />
                <div>
                  <div>Vagas</div>
                  <div className="font-bold">
                    {property.parkingSpace === '' ? 0 : property.parkingSpace }
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-x-8 gap-y-4 flex-wrap">
            <div>
              <div>Logradouro</div>
              <p className="font-bold">
                {capitalizeText(property.address)}
              </p>
            </div>

            <div>
              <div>Bairro</div>
              <p className="font-bold">
                {capitalizeText(property.neighborhood)}
              </p>
            </div>

            <div>
              <div>Cidade</div>
              <p className="font-bold">
                {capitalizeText(property.city)}
              </p>
            </div>
          </div>

          <div className="my-5">
            <div>Proprietário</div>
            <p className="font-bold">
              {capitalizeText(property.owner)}
            </p>
          </div>

          <a 
            href={`https://api.whatsapp.com/send?phone=${property.tel}&text=Olá, ${property.owner}! Vi o anúncio do ${property.title} na WebImóveis e fiquei interessado.`}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer my-5 w-full bg-green-500 text-white flex items-center justify-center rounded-lg gap-2 h-11 text-lg font-medium hover:opacity-90"  
          >
            Conversar com vendedor
            <FaWhatsapp />
          </a>

        </main>
        )}

      </div>
    )
}