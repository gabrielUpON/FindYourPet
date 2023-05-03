import React, { useEffect, useState } from 'react'
import PetsDetails from '../components/PetsDetails'
import Footer from '../components/Footer'
import AddPetButton from '../components/AddPetButton'
import imageNotFound from '../../assets/imagenotfound.png'
import ImgServices from '../services/img.services'
import PetServices from '../services/pet.services'
import Navigation from '../components/Navigation'

function Pets() {
    const [Pets, setPets] = useState([])

    useEffect(() => {
        getPets()
    }, [])

    const getPets = async () => {
        const data = await PetServices.getAllPets()
        setPets(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        console.log(data.docs.map((doc) => doc.data().validUntil))
    }

    const deletePets = async (id, image) => {
        await Promise.all([PetServices.deletePets(id), ImgServices.deleteImage(image)])
    }
    
    async function checkTime() {
        const data = await PetServices.getAllPets()

        const now = new Date()
        const year = now.getFullYear()
        const month = (now.getMonth() + 1).toString().padStart(2, '0')
        const day = now.getDate().toString().padStart(2, '0')
        const today = `${day}/${month}/${year}`

        //if (today === data.docs.map((doc) => doc.data()))
    }

    const firebaseURL = 'https://firebasestorage.googleapis.com/v0/b/kalify-findyourpet.appspot.com/o/files%2F'

    return (
        <PetsDetails>
            <Navigation />

            <a href="/cadastro" className="advice">
                <i className="uil uil-shield-exclamation"></i>&nbsp;Você perdeu um animal? Está querendo doar um? Ou encontrou um perdido? Cadastre ele!&nbsp;<i className="uil uil-shield-exclamation"></i>
            </a>

            {/* <div className="categories">
                <h2>Categorias</h2>
                <div className="categories-list">
                    <a onClick={LostAnimals} className="menu">Animais perdidos</a>
                    <a onClick={RescueAnimals} className="menu">Animais resgatados</a>
                    <a onClick={AdoptAnimals} className="menu">Animais em adoção</a>
                    <a onClick={MapAnimals} className="menu">Animais no mapa</a>
                </div>
            </div> */}

            <h2 className="titlePets">Últimos animais cadastrados:</h2>
            {/* <div className="advicePets"><i>*Os animais serão deletados automaticamente após dez dias após a data da publicação</i></div> */}
            <div className="pets-list">
                {
                    Pets && Pets.map((pets, index) => (
                        <a href={`https://api.whatsapp.com/send/?phone=` + pets?.contact + '&text=Olá%2C+tudo+bom%3F+Vim+do+FindYourPet+e+estou+interessada+em+saber+mais+a+respeito+do+pet+que+está+no+anúncio+..'} target="_blank" rel="noreferrer" key={index}>
                            <div className="pets-list-item">
                                <img src={pets.image ? firebaseURL + pets.image + `?alt=media` : imageNotFound} alt={pets?.name} />

                                <div className="pets-list-item-info">
                                    <h3>{pets?.name} • {pets?.status}</h3>
                                    <p>{pets?.description}</p>
                                    <p><i className="uil uil-map-marker"></i> {pets?.locale}</p>
                                    <p><i className="uil uil-whatsapp"></i> {pets?.contact}</p>
                                </div>
                            </div>
                        </a>
                    ))
                }

            </div>
            <AddPetButton />

            <Footer />
        </PetsDetails>
    )
}

export default Pets
