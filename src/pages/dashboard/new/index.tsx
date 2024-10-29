import { FiUpload, FiTrash } from 'react-icons/fi'
import { DashboardHeader } from '../../../components/panelHeader'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChangeEvent, useState, useContext, useEffect } from 'react'
import { AuthContext } from '../../../contexts/AuthContext'
import { v4 as uuidV4 } from 'uuid'
import { storage, db } from '../../../services/firebaseConnection'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { addDoc, collection } from 'firebase/firestore';
import toast from 'react-hot-toast'

const schema = z.object({
  title: z.string().min(1, 'O título é obrigatório'),
  address: z.string().min(1, 'O endereço é obrigatório'),

  area: z.string().min(1, 'O campo área é obrigatório'),

  rooms: z.string()
    .refine((value) => !isNaN(Number(value)), {
      message: "Insira um número válido",
    })
    .transform((value) => Number(value))
    .refine((value) => value >= 1, {
      message: "O campo de quartos é obrigatório",
    }),
  bathrooms: z.string()
    .refine((value) => !isNaN(Number(value)), {
      message: "Insira um número válido",
    })
    .transform((value) => Number(value))
    .refine((value) => value >= 1, {
      message: "O campo banheiros é obrigatório",
    }),
  parkingSpace: z.string()
    .optional()
    .refine((value) => !isNaN(Number(value)), {
      message: "Insira um número válido",
    })
    .transform((value) => value ? Number(value) : value),
  modality: z.enum(['sale', 'rent'], {
    errorMap: () => ({ message: 'Selecione a modalidade' }),
  }),
  
  price: z.string().min(1, "O preço é obrigatório"),

  iptu: z.string(),
  condomininium: z.string(),
  city: z.string().min(1, 'A cidade é obrigatória'),
  neighborhood: z.string().min(1, 'O bairro é obrigatório'),
  whatsapp: z.string().min(1, 'O telefone é obrigatório')
  .refine((value) => value.length > 14, {
    message: "Insira um telefone válido",
  }),
  description: z.string().min(1, 'A descrição é obrigatória')
})

type FormData = z.infer<typeof schema>

interface ImageItemProps{
  uid: string;
  name: string;
  url: string;
}

function formatToBRLCurrency(value: string) {
  const numericValue = Number(value.replace(/\D/g, '')) / 100;
  return numericValue.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function New() {
    const { user } = useContext(AuthContext)
    const [propertyImages, setPropertyImages] = useState<ImageItemProps[]>([]);
    const [area, setArea] = useState('')
    const [price, setPrice] = useState('');
    const [iptu, setIptu] = useState('');
    const [cond, setCond] = useState('');
    const [phone, setPhone] = useState('');

    const { register, setValue, handleSubmit, formState: {errors}, reset } = useForm<FormData>({
      resolver: zodResolver(schema),
      mode: 'onChange'
    })

    useEffect(() => {
      const storedImages = localStorage.getItem('propertyImages');
      if (storedImages) {
        setPropertyImages(JSON.parse(storedImages));
      }
    }, []);  

    function onSubmit(data: FormData){
      if(propertyImages.length === 0){
        toast.error('Envie ao menos 1 imagem!')
        return
      }
      
      addDoc(collection(db, "imóveis"), {
        title: data.title,
        address: data.address.toUpperCase(),
        area: data.area,
        rooms: data.rooms,
        bathrooms: data.bathrooms,
        parkingSpace: data.parkingSpace,
        modality: data.modality,
        price: Number(data.price.replace(/\./g, '').replace(',', '.')),
        iptu: data.iptu ? Number(data.iptu.replace(/\./g, '').replace(',', '.')).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '',
        cond: !!data.condomininium ? Number(data.condomininium.replace(/\./g, '').replace(',', '.')).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '',
        city: data.city.toUpperCase(),
        neighborhood: data.neighborhood.toUpperCase(),
        tel: Number(data.whatsapp.replace(/\D/g, '')),
        desc: data.description,
        created: new Date(),
        owner: user?.name,
        uid: user?.uid,
        images: propertyImages
      })
      .then(() => {
        reset();
        setPropertyImages([])
        localStorage.setItem('propertyImages', JSON.stringify([]))
        console.log('Cadastrado com sucesso!');
        toast.success('Imóvel cadastrado!')
      }).catch((err) => {
        console.log(err);
        toast.error('Erro ao cadastrar imóvel')
      })
    }

    async function handleFile(e: ChangeEvent<HTMLInputElement>){
      if (e.target.files && e.target.files[0]){
        const image = e.target.files[0]

        if (image.type === 'image/jpeg' || image.type === 'image/png'){
          await handleUpload(image)
        } else{
          alert('Envie uma imagem jpeg ou png!')
          return
        }
      }
    }

    async function handleUpload(image: File){
      if(!user?.uid){
        return
      }

      const currentUid = user?.uid;
      const uidImage = uuidV4(); //gera um identificador único

      const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`) //caminho: images/uid-do-usuario/uid-da-imagem

      uploadBytes(uploadRef, image)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadUrl) => {
          const imageItem: ImageItemProps = {
            name: uidImage,
            uid: currentUid,
            url: downloadUrl
          }
          
          setPropertyImages((images) => {
            const updatedImages = [imageItem, ...images];
            localStorage.setItem('propertyImages', JSON.stringify(updatedImages));
          
            return updatedImages;
          })
        })
      })
    }

    async function handleDelete(item: ImageItemProps){
      const imagePath = `images/${item.uid}/${item.name}`

      const imageRef = ref(storage, imagePath);

      try{
        await deleteObject(imageRef);
        const updatedImages = propertyImages.filter((property) => property.url !== item.url)
        setPropertyImages(updatedImages)
        localStorage.setItem('propertyImages', JSON.stringify(updatedImages))
      } catch{
        console.log('Erro ao deletar');
      }
    }

    const handleAreaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value
      const formattedValue = formatToBRLCurrency(inputValue);
      
      setArea(formattedValue);
      setValue('area', formattedValue)
    };

    const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value
      const formattedValue = formatToBRLCurrency(inputValue);
      
      setPrice(formattedValue);
      setValue('price', formattedValue)
    };

    const handleIptuChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value
      const formattedValue = formatToBRLCurrency(inputValue);
      
      setIptu(formattedValue);
      setValue('iptu', formattedValue)
    };

    const handleCondChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value
      const formattedValue = formatToBRLCurrency(inputValue);
      
      setCond(formattedValue);
      setValue('condomininium', formattedValue)
    };

    const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
      
      let formattedValue = inputValue;
      if (inputValue.length <= 2) {
        formattedValue = `(${inputValue})`;
      } else if (inputValue.length <= 7) {
        formattedValue = `(${inputValue.slice(0, 2)}) ${inputValue.slice(2)}`;
      } else {
        formattedValue = `(${inputValue.slice(0, 2)}) ${inputValue.slice(2, 7)}-${inputValue.slice(7, 11)}`;
      }

      setPhone(formattedValue)
      setValue('whatsapp', formattedValue);
    };

    return (
      <div className="container mb-4">
        <DashboardHeader/>
        
        <div className='w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2'>
          <button className='border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48'>
            <div className='absolute cursor-pointer'>
              <FiUpload size={30} color='#000'/>
            </div>
            <div className='cursor-pointer'>
              <input
                type="file"
                accept='image/*'
                className='cursor-pointer max-w-48 opacity-0'
                onChange={handleFile}
              />
            </div>
          </button>

          {propertyImages.map((item) => (
            <div key={item.name} className='flex justify-end'>
              <button className='absolute bg-red-400 rounded-lg text-white hover:text-red-700 p-2' onClick={() => handleDelete(item)}>
                <FiTrash size={18}/>
              </button>
              <img 
                src={item.url}
                alt='Foto do imóvel'
                className='rounded-lg w-full h-32 object-cover'
              />
            </div>
          ))}
        </div>

        <div className='w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2'>
          <form 
            className='w-full'
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className='mb-3'>
              <label htmlFor='title' className='inline-block mb-2 font-medium'>Título do anúncio</label>
              <input 
                type="text"
                {...register('title')}
                id="title"
                className='input'
                placeholder='Ex: Apartamento com 1 suíte, térreo...'
              />
              {errors.title && <p className='errors'>{errors.title.message}</p>}
            </div>

            <div className='mb-3'>
              <label htmlFor='address' className='inline-block mb-2 font-medium'>Endereço</label>
              <input 
                type="text"
                {...register('address')}
                id="address"
                className='input'
                placeholder='Ex: Rua Eustáquio da Silva, 120'
              />
              {errors.address && <p className='errors'>{errors.address.message}</p>}
            </div>

            <div className='grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 w-full mb-3 gap-3'>
              <div className='w-full'>
                <label htmlFor='area' className='inline-block mb-2 font-medium'>Área em m²</label>
                <input 
                  type="text"
                  {...register('area')}
                  id="area"
                  onChange={handleAreaChange}
                  value={area}
                  className='input'
                  placeholder='Ex: 50,00'
                />
                {errors.area && <p className='errors'>{errors.area.message}</p>}
              </div>
              
              <div className='w-full'>
                <label htmlFor='rooms' className='inline-block mb-2 font-medium'>Número de quartos</label>
                <input 
                  type="text"
                  {...register('rooms')}
                  id="rooms"
                  className='input'
                  placeholder='Ex: 2'
                />
                {errors.rooms && <p className='errors'>{errors.rooms.message}</p>}
              </div>

              <div className='w-full'>
                <label htmlFor='bathrooms' className='inline-block mb-2 font-medium'>Número de banheiros</label>
                <input 
                  type="text"
                  {...register('bathrooms')}
                  id="bathrooms"
                  className='input'
                  placeholder='Ex: 2'
                />
                {errors.bathrooms && <p className='errors'>{errors.bathrooms.message}</p>}
              </div>

              <div className='w-full'>
                <label htmlFor='parkingSpace' className='inline-block mb-2 font-medium'>Vaga(s) de carro</label>
                <input 
                  type="text"
                  {...register('parkingSpace')}
                  id="parkingSpace"
                  className='input'
                  placeholder='Ex: 1'
                />
                {errors.parkingSpace && <p className='errors'>{errors.parkingSpace.message}</p>}
              </div>
            </div>

            <div className='grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 w-full mb-3 gap-3'>
              <div className='w-full font-medium flex justify-center flex-col'>
                <h4 className='mb-2'>Modalidade</h4>

                <div className='input flex items-center justify-center'>
                  <label>
                    <input
                      type="radio"
                      value="sale"
                      {...register('modality')}
                      className='mr-1'
                    />
                    Venda
                  </label>
              
                  <label>
                    <input
                      type="radio"
                      value="rent"
                      {...register('modality')}
                      className='ml-3 mr-1'
                    />
                    Aluguel
                  </label>
                </div>

                {errors.modality && <p className='errors'>{errors.modality.message}</p>}
              </div>

              <div className='w-full'>
                <label htmlFor='price' className='inline-block mb-2 font-medium'>Preço em R$</label>
                <input 
                  type="text"
                  {...register('price')}
                  id="price"
                  value={price}
                  onChange={handlePriceChange}
                  className='input'
                  placeholder='Ex: 950,00'
                />
                {errors.price && <p className='errors'>{errors.price.message}</p>}
              </div>

              <div className='w-full'>
                <label htmlFor='iptu' className='inline-block mb-2 font-medium'>IPTU em R$</label>
                <input 
                  type="text"
                  {...register('iptu')}
                  id="iptu"
                  onChange={handleIptuChange}
                  value={iptu}
                  className='input'
                  placeholder='Ex: 200,00'
                />
                {errors.iptu && <p className='errors'>{errors.iptu.message}</p>}
              </div>

              <div className='w-full'>
                <label htmlFor='condomininium' className='inline-block mb-2 font-medium'>Condomínio em R$</label>
                <input 
                  type="text"
                  {...register('condomininium')}
                  id="condomininium"
                  onChange={handleCondChange}
                  value={cond}
                  className='input'
                  placeholder='Ex: 350,00'
                />
                {errors.condomininium && <p className='errors'>{errors.condomininium.message}</p>}
              </div>
            </div>

            <div className='grid grid-cols-2 w-full mb-3 gap-3'>
              <div className='w-full'>
                <label htmlFor='city' className='inline-block mb-2 font-medium'>Cidade</label>
                <input 
                  type="text"
                  {...register('city')}
                  id="city"
                  className='input'
                  placeholder='Ex: Rio de Janeiro'
                />
                {errors.city && <p className='errors'>{errors.city.message}</p>}
              </div>

              <div className='w-full'>
                <label htmlFor='neighborhood' className='inline-block mb-2 font-medium'>Bairro</label>
                <input 
                  type="text"
                  {...register('neighborhood')}
                  id="neighborhood"
                  className='input'
                  placeholder='Ex: Tijuca'
                />
                {errors.neighborhood && <p className='errors'>{errors.neighborhood.message}</p>}
              </div>
            </div>

            <div className='mb-3'>
              <label htmlFor='whatsapp' className='inline-block mb-2 font-medium'>Telefone / WhatsApp</label>
              <input 
                type="text"
                {...register('whatsapp')}
                onChange={handlePhoneChange}
                value={phone}
                id="whatsapp"
                className='input'
                placeholder='Ex: 021998877665'
              />
              {errors.whatsapp && <p className='errors'>{errors.whatsapp.message}</p>}
            </div>

            <div className='mb-3'>
              <label htmlFor='description' className='inline-block mb-2 font-medium'>Descrição</label>
              <textarea
                {...register('description')}
                id="description"
                className='input min-h-24'
                placeholder='Ex: Apartamento próximo à farmácias e padaria. O condomínio possui academia, piscina...'
              />
              {errors.description && <p className='errors'>{errors.description.message}</p>}
            </div>

            <button type='submit' className='bg-black w-full h-11 rounded-md text-white font-medium mb-3 hover:opacity-90'>
              Cadastrar
            </button>
          </form>
        </div>
      </div>
    )
}