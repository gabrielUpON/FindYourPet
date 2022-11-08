import React, { useState } from 'react'
import PetsDetails from '../components/PetsDetails'
import Footer from '../components/Footer'
import FormSignUpDetails from '../components/FormSignUpDetails'
import PetServices from '../services/pet.services'
import { storage } from '../client'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import Navigation from '../components/Navigation'

const SignUp = () => {
    const [PetName, setPetName] = useState('');
    const [PetDescription, setPetDescription] = useState('');
    const [PetFile, setPetFile] = useState('');
    const [PetPercent, setPetPercent] = useState(0);
    const [PetLocale, setPetLocale] = useState('');
    const [PetContact, setPetContact] = useState('');
    const [PetSituation, setPetSituation] = useState('');

    // Get Type Situation of Pet - Adopt, Rescue or Lost
    function sendDataSelect() {
        const formStatus = document.getElementById('status')
        const resultStatus = formStatus.value
        setPetSituation(resultStatus)
        console.log('Status:', resultStatus)
    }

    function collectData() {
        const formName = document.getElementById('name')
        const resultName = formName.value
        setPetName(resultName)

        const formDescription = document.getElementById('description')
        const resultDescription = formDescription.value
        setPetDescription(resultDescription)

        const formLocale = document.getElementById('locale')
        const resultLocale = formLocale.value
        setPetLocale(resultLocale)

        const formContact = document.getElementById('contact')
        const resultContact = formContact.value
        setPetContact('+55' + resultContact)
    }

    function getImage(event) {
        setPetFile(event.target.files[0]);
    }

    function sendData() {
        if (!PetName || !PetDescription || !PetLocale || !PetContact) {
            alert('Por favor, preencha todos os campos')
        } else {
            async function addToFirebase() {
                const NewPets = {
                    name: PetName,
                    description: PetDescription,
                    locale: PetLocale,
                    contact: PetContact,
                    status: PetSituation
                }

                await (PetServices.addPets(NewPets))
                function Redirect() {
                    location.assign("/pets");
                }
                Redirect();
            }
            addToFirebase();

            const storageRef = ref(storage, `/files/${PetFile.name}`);
            const uploadTask = uploadBytesResumable(storageRef, PetFile);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const percent = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );

                    setPetPercent(percent);
                },
                (error) => console.log(error),
                () => {
                    // download url
                    getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                        console.log(url);
                    });
                }
            )
        }
    }

    return (
        <>
            <PetsDetails>
                <Navigation />

                <a href="/cadastro" className="advice-yellow">
                    <i className="uil uil-shield-exclamation"></i>&nbsp;
                    Procure colocar as informações corretamente - Não será possível editar depois!
                    &nbsp;<i className="uil uil-shield-exclamation"></i>
                </a>
            </PetsDetails>

            <FormSignUpDetails>
                <form onChange={() => collectData()}>
                    <h4>Nome do Animal</h4>
                    <input type="text" id="name" placeholder="Nome do Animalzinho"
                        maxLength={15} size={24} />

                    <h4>Foto do Animal</h4>
                    <input type="file" id="photo" onChange={getImage}></input>
                    <p>{PetPercent} "% Uploading...</p>

                    <h4>Descrição do Animal</h4>
                    <textarea id="description" placeholder="Cachorro pequeno, Pêlo branco, carinhoso, gosta de bolinhas" maxLength={50}
                        rows="4" cols="28" size={30} />

                    <h4>Bairro/Cidade do Animal</h4>
                    <input type="text" id="locale" placeholder="Seu Bairro e Cidade"
                        maxLength={20} size={24} />

                    <h4>Qual é a Situação:</h4>
                    <select id="status" onChange={() => sendDataSelect()}>
                        <option value="">Selecione</option>
                        <option value="Doação">Doação</option>
                        <option value="Encontrado">Animal Encontrado</option>
                        <option value="Perdido">Animal Perdido</option>
                    </select>

                    <h4>Número do WhatsApp*</h4>
                    <div>
                        <input type="text" id="contact" placeholder="19123456789"
                            maxLength={11} size={24} />
                    </div>
                    <i>*Não coloque espaço, traço ou parentêses</i>

                    <div>
                        <button type="reset" className="reset">Limpar</button>
                        <button type="button" className="send" onClick={sendData}>Cadastrar</button>
                    </div>
                </form>
            </FormSignUpDetails>

            <Footer />
        </>
    )
}

export default SignUp