import React, {useState} from 'react'
import Stepper from "../components/Steppper";
import {useNavigate} from "react-router-dom";
import {MenuItem, Select} from "@mui/material";
import {
    setNameAction,
    setNicknameAction, setSexAction, setSurnameAction,
    useName,
    useNickname,
    useSex,
    useSurname
} from "../store_redux/slices/dataUser";
import {useDispatch} from "react-redux";
import Button from "../components/Button";
import Error from "../components/Error";
import {schemaFirstPage} from "../components/Yup";

export function FirstPage() {
    const nicknameDone = useNickname()
    const nameDone = useName()
    const surnameDone = useSurname()
    const sexDone = useSex()
    const navigate = useNavigate()
    const [sex, setSex] = useState(sexDone)
    const [nickname, setNickname] = useState(nicknameDone)
    const [name, setName] = useState(nameDone)
    const [surName, setSurname] = useState(surnameDone)
    const [errorNickname, setErrorNickname] = useState(null);
    const [errorName, setErrorName] = useState(null);
    const [errorSurName, setErrorSurname] = useState(null);
    const [errorSex, setErrorSex] = useState(null);
    const dispatch = useDispatch()
    const dispatching = () => {
        dispatch(setNicknameAction(nickname))
        dispatch(setNameAction(name))
        dispatch(setSurnameAction(surName))
        dispatch(setSexAction(sex))
    }
    const HandleClick = () => {
        schemaFirstPage.validate({
            nickname: nickname,
            name: name,
            surname: surName,
            sex: sex
        }, {abortEarly: false}).then(val => {
                dispatching()
                navigate('/2')
            }
        ).catch(error => {
            const errors = error.errors
            if (errors.includes('1')) setErrorNickname('Enter your Nickname')
            else if(errors.includes('4')) setErrorNickname('Please, don`t use special symbols')
            else setErrorNickname(null)
            if (errors.includes('2')) setErrorName('Enter your Name')
            else if(errors.includes('5')) setErrorName('Please, don`t use numbers')
            else setErrorName(null)
            if (errors.includes('3')) setErrorSurname('Enter your Surname')
            else if(errors.includes('6')) setErrorSurname('Please, don`t use numbers')
            else setErrorSurname(null)
            if (errors.includes('7')) setErrorSex('Please, select your Sex')
            else setErrorSex(null)
        })
    }
    return (
        <div className="main-page-container">
            <Stepper step={0}/>
            <div className="InputFirst">
                <label className="title-">NickName</label>
                <input id="field-nickname" placeholder="Nickname" maxLength={30} value={nickname} className="input-area input-areaFirstPage"
                       onChange={(event) => setNickname(event.target.value)}/>
                {errorNickname && <Error>{errorNickname}</Error>}
            </div>
            <div className="InputFirst">
                <label className="title-">Name</label>
                <input id="field-name" placeholder="Name" maxLength={50} value={name} className="input-area input-areaFirstPage"
                       onChange={(event) => setName(event.target.value)}/>
                {errorName && <Error>{errorName}</Error>}
            </div>
            <div className="InputFirst">
                <label className="title-">Surname</label>
                <input id="field-surname" placeholder="Surname" maxLength={50} value={surName} className="input-area input-areaFirstPage"
                       onChange={(event) => setSurname(event.target.value)}/>
                {errorSurName && <Error>{errorSurName}</Error>}
            </div>
            <div className="InputFirst select">
                <label className="title-">Sex</label>
                <Select id="field-sex" value={sex} className="input-area select input-areaFirstPage "
                        onChange={(event) => setSex(event.target.value)}>
                    {sex === 'n' && <MenuItem className="notChosen" disabled value="n">
                        Не выборано
                    </MenuItem>}
                    <MenuItem id="field-sex-option-man" value='Man'>Man</MenuItem>
                    <MenuItem id="field-sex-option-woman" value='Woman'>Woman</MenuItem>
                </Select>
                {errorSex && <Error>{errorSex}</Error>}
            </div>
            <div className='btn-pos'>
                <Button id="button-back" outline onClick={() => {
                    dispatching()
                    navigate('/')
                }}>Назад</Button>
                <Button id="button-next" onClick={HandleClick}>Далее</Button>
            </div>
        </div>
    )
}