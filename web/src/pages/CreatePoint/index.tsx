import React, {useEffect, useState,ChangeEvent,FormEvent} from 'react';

import './styles.css';

import logo from '../../assets/logo.svg';
import {Link, useHistory} from 'react-router-dom';
import {FiArrowLeft} from 'react-icons/fi';

import {Map,TileLayer,Marker} from 'react-leaflet';
import {LeafletMouseEvent} from 'leaflet';

import api from '../../services/api';

import Dropzone from '../../components/Dropzone';


import axios from 'axios';

interface Item {
    id:number;
    title:string;
    image_url:string;

}

interface IBGEUFResponse {
    sigla:string;
}

interface IBGECityResponse {
    nome:string;
}





const CreatePoint = ()=>{


    //Sempre que criamos estado para array ou objeto:  PRecisamos manualmene informar o tipo da variável
    
    const [items,setItems] = useState<Item[]>([]);
    const [ufs,setUFs] = useState<string[]>([]);
    const [cities,setCities] = useState<string[]>([]);



    const [initialPosition,setInitialPosition] = useState<[number,number]>([0,0]);

    const [formData,setFormData]=  useState({
        name:'',
        email:'',
        whatsapp:''

    });
    const [selectedUf,setSelectecUf] = useState('0');
    const [selectedCity,setSelectecCity] = useState('0');
    const [selectedPosition,setSelectecPosition] = useState<[number,number]>([0, 0]);

    const [selectedItems,setSelectecItems] = useState<number[]>([]);


    const [selectedFile,setSelectedFile] =useState<File>();

    const history = useHistory();
    useEffect(()=>{
        navigator.geolocation.getCurrentPosition(position=>{
            const {latitude,longitude} =position.coords;

            setInitialPosition([latitude,longitude]);
        })
    },[]);

    useEffect(()=>{
        api.get('items').then(response=>{

            setItems(response.data);
        });
    },[]);

    useEffect(()=>{
        axios.get<[IBGEUFResponse]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response=>{
            //console.log(response.data);
            const ufInitials = response.data.map(uf=> uf.sigla);
            setUFs(ufInitials);
        });
    },[]);

    useEffect(()=>{
        //Carregar as cidades sempre que a uf carregar

        if (selectedUf==='0'){
            return;
        }
        axios
        .get<[IBGECityResponse]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
        .then(response=>{
            //console.log(response.data);
            const cityNames = response.data.map(city=> city.nome);
            setCities(cityNames);
        });
    },[selectedUf]);

    function handleSelectUf(event:ChangeEvent<HTMLSelectElement>){
        //console.log('aa');

        const uf = event.target.value;
        setSelectecUf(uf);
         //console.log(selectedUf);
        //console.log(uf);
    }

    function handleSelectCity(event:ChangeEvent<HTMLSelectElement>){
        //console.log('aa');

        const city = event.target.value;
        setSelectecCity(city);
         //console.log(selectedUf);
        //console.log(uf);
    }

    function handleMapClick(event:LeafletMouseEvent){
        //console.log(event.latlng);
        setSelectecPosition([
            event.latlng.lat,
            event.latlng.lng
        ]);


    }


    
    function handleInputChange(event:ChangeEvent<HTMLInputElement>){
        //console.log('aa');
        const {name,value} = event.target;

        setFormData({...formData,[name]:value});
         //console.log(selectedUf);
        //console.log(uf);
    }

    function handleSelectItem(id:number){
        //console.log('aa');
        const alreadySelected = selectedItems.findIndex(item=>item===id);
        if (alreadySelected>=0){
            const filteredItems = selectedItems.filter(item=> item!==id);
            setSelectecItems(filteredItems);
        }else{
            setSelectecItems([... selectedItems,id]);

        }

         //console.log(selectedUf);
        //console.log(uf);
    }


    async function  handleSubmit(event:FormEvent){
        event.preventDefault();
        const {name,email,whatsapp} =formData;
    
        const uf =selectedUf;
        const city = selectedCity;
        const [latitude,longitude]=selectedPosition;
        const items= selectedItems;


        const data = new FormData();

    


        data.append('name',name);
        data.append('email',email)
        data.append('whatsapp',whatsapp);
        data.append('uf',uf);
        data.append('city',city);
        data.append('latitude',String(latitude));
        data.append('longitude',String(longitude));
        data.append('items',items.join(','));

        if (selectedFile){
            data.append('image',selectedFile);
        }

        console.log(data);
        await api.post('points',data);
        alert('Ponto de Coleta Criado');
        history.push('/');
    }

    return(
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>
                <Link to="/">

                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>
        <form onSubmit={handleSubmit}>
            
            <h1>Cadastro do <br/> ponto de coleta</h1>
            <Dropzone onFileUploaded={setSelectedFile} />
        <fieldset>
            <legend>
                <h2>
                    Dados
                </h2>
            </legend>
                <div className="field">
                    <label htmlFor="name">Nome da entidade</label>
                    <input type="text"
                    name="name"
                    id="name"
                    onChange={handleInputChange}
                    />
                </div>

                <div className="field-group">
                    <div className="field">
                        <label htmlFor="email">E-mail</label>
                        <input type="email"
                        name="email"
                        id="email"
                        onChange={handleInputChange}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="whatsapp">Whatsapp</label>
                        <input type="whatsapp"
                        name="whatsapp"
                        id="whatsapp"
                        onChange={handleInputChange}
                        />
                    </div>
                </div>

        </fieldset>
        <fieldset>
            <legend>
                <h2>
                    Endereço
                </h2>
                <span>Selecione o enderço no mapa</span>
            </legend>

            <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
            <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={selectedPosition} />
            </Map>


            <div className="field-group">
                <div className="field">
                    <label htmlFor="uf">Estado (UF)</label>
                    <select name="uf"
                     id="uf"
                     value={selectedUf}
                     onChange={handleSelectUf}>           
                        <option value="0">Selecione uma UF</option>
                        {ufs.map(uf=>(
                        <option key={uf} value={uf}>{uf}</option>
                        ))}
                    </select>
                </div>
                <div className="field">
                    <label htmlFor="city">Cidade</label>
                    <select name="city"
                     id="city"
                     value={selectedCity}
                     onChange={handleSelectCity}>
                        <option value="0">Selecione uma cidade</option>
                        {cities.map(city=>(
                        <option key={city} value={city}>{city}</option>

                        ))}
                        </select>
                        
                </div>

            </div>

        </fieldset>


        <fieldset>


            <legend>
                <h2>
                    Itens de coleta
                </h2>
                <span>Selecione um ou mais itens abaixo</span>
            </legend>
            
            <ul className="items-grid">
                {items.map(item=>(
                                <li key={item.id} onClick={()=>handleSelectItem(item.id)}
                                className={selectedItems.includes(item.id)? 'selected': ''}
                                >
                                <img src={item.image_url} alt={item.title}/>
                                <span>{item.title}</span>
                                </li>

                ))}
            </ul>

        </fieldset>
        <button type="submit">Cadastrar ponto de coleta</button>
        </form>
        </div>


    );


} 

export default CreatePoint;