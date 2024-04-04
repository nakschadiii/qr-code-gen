import { QRCodeCanvas } from '@loskir/styled-qr-code-node';
import { useState, useRef, useEffect, createContext, useContext } from 'react';
import styled from 'styled-components';

const AppContext = createContext(null);

const Flex = styled.div`
    display: flex;
    ${props => (props.$direction ?? 'row') && `flex-direction: ${props.$direction ?? 'row'}`};
    ${props => props.$align && `align-items: ${props.$align}`};
    ${props => props.$justify && `justify-content: ${props.$justify}`};
    ${props => props.$width && `width: ${props.$width}`};
    ${props => props.$height && `height: ${props.$height}`};
    ${props => props.$gap && `gap: ${props.$gap}`};
    ${props => props.$padding && `padding: ${props.$padding}`};
    ${props => props.$paddingBottom && `padding-bottom: ${props.$paddingBottom}`};
    ${props => props.$paddingTop && `padding-top: ${props.$paddingTop}`};
    ${props => props.$paddingLeft && `padding-left: ${props.$paddingLeft}`};
    ${props => props.$paddingRight && `padding-right: ${props.$paddingRight}`};
    ${props => props.$margin && `margin: ${props.$margin}`};
    ${props => props.$marginBottom && `margin-bottom: ${props.$marginBottom}`};
    ${props => props.$marginTop && `margin-top: ${props.$marginTop}`};
    ${props => props.$marginLeft && `margin-left: ${props.$marginLeft}`};
    ${props => props.$marginRight && `margin-right: ${props.$marginRight}`};
`;

export default function App() {
    const [url, setUrl] = useState('');
    const [form, setForm] = useState({
        data: "",
        margin: 200,
        errorCorrectionLevel: 'H',
        bg: {
            gradientAngle: 0,
            gradientStops: [
                {color: "#000000", offset: 0.0}
            ]
        },
        dotsStyle: "square",
        dots: {
            gradientAngle: 0,
            gradientStops: [
                {color: "#ffffff", offset: 0.0}
            ]
        },
        cornerSquareStyle: "square",
        cornerSquare: {
            gradientActive: false,
            gradientAngle: 0,
            gradientStops: [
                {color: "#ffffff", offset: 0.0}
            ]
        },
        cornerDotStyle: "square",
        cornerDots: {
            gradientActive: false,
            gradientAngle: 0,
            gradientStops: [
                {color: "#ffffff", offset: 0.0}
            ]
        },
    })

    useEffect(() => {
        handleChange(form)
    }, []);

    const handleChange = (form) => {
        const qrCode = new QRCodeCanvas({
            width: 3000, height: 3000,
            data: form.data,
            margin: form.margin,
            backgroundOptions: {
                gradient: {
                    type: form.bg.gradientType,
                    rotation: (form.bg.gradientAngle / 100) * (2 * Math.PI),
                    /*colorStops: [
                        { offset: 0, color: 'black' },
                    ]*/
                    colorStops: form.bg.gradientStops.map(
                        stop => {
                            return {
                                color: stop.color,
                                offset: stop.offset/100
                            }
                        }
                    )
                }
            },
            qrOptions: {
                errorCorrectionLevel: form.errorCorrectionLevel,
            },
            dotsOptions: {
                type: form.dotsStyle,
                gradient: {
                    type: form.dots.gradientType,
                    rotation: (form.dots.gradientAngle / 100) * (2 * Math.PI),
                    colorStops: form.dots.gradientStops.map(
                        stop => {
                            return {
                                color: stop.color,
                                offset: stop.offset/100
                            }
                        }
                    )
                }
            },
            cornersSquareOptions: {
                type: form.cornerSquareStyle,
                [form.cornerSquare.gradientActive && "gradient"]: {
                    colorStops: form.cornerSquare.gradientStops.map(
                        stop => {
                            return {
                                color: stop.color,
                                offset: stop.offset/100
                            }
                        }
                    )
                }
            },
            cornersDotOptions: {
                type: form.cornerDotStyle,
                [form.cornerDots.gradientActive && "gradient"]: {
                    colorStops: form.cornerDots.gradientStops.map(
                        stop => {
                            return {
                                color: stop.color,
                                offset: stop.offset/100
                            }
                        }
                    )
                }
            }
        });

        qrCode?.toDataUrl().then(url => {
            setUrl(url);
            setForm(form);
        })
    }


    return <AppContext.Provider value={{ form, handleChange }}>
        <h1>QR Code</h1>
        <Flex>
            <img src={url} style={{ width: 300, height: 300 }} />
            <Flex $direction={"column"}>
                <input type={"text"} onChange={e => handleChange({ ...form, data : e.target.value })} defaultValue={form.data} placeholder={"URL"} />
                
                <input type={"number"} onChange={e => handleChange({ ...form, margin : e.target.value })} defaultValue={form.margin} placeholder={"Marge"} step={50} />

                <select defaultValue={form.errorCorrectionLevel} onChange={e => handleChange({ ...form, errorCorrectionLevel : e.target.value })}>
                    <option value={"H"}>H</option>
                    <option value={"L"}>L</option>
                    <option value={"M"}>M</option>
                    <option value={"Q"}>Q</option>
                </select>

                <h2>Fond</h2>
                <GradientStops column={"bg"} />

                <h2>Points</h2>
                <select defaultValue={form.dotsStyle} onChange={e => handleChange({ ...form, dotsStyle : e.target.value })}>
                    <option value={"dots"}>Points</option>
                    <option value={"rounded"}>Arrondi</option>
                    <option value={"extra-rounded"}>Extra arrondi</option>
                    <option value={"classy"}>Classe</option>
                    <option value={"classy-rounded"}>Classe et Arrondi</option>
                    <option value={"square"}>Carré</option>
                </select>
                <GradientStops column={"dots"} />

                <h2>Coins</h2>

                <h3>Carré</h3>
                <select defaultValue={form.cornerSquareStyle} onChange={e => handleChange({ ...form, cornerSquareStyle : e.target.value })}>
                    <option value={"dot"}>Points</option>
                    <option value={"square"}>Carre</option>
                    <option value={"extra-rounded"}>Extra arrondi</option>
                </select>
                <label>
                    <input type="checkbox" defaultChecked={form.cornerSquare.gradientActive} onChange={e => handleChange({ ...form, cornerSquare : {...form.cornerSquare, gradientActive : e.target.checked } })} />
                    Dissocier couleur
                </label>
                {form.cornerSquare.gradientActive && <GradientStops column={"cornerSquare"} />}

                <h3>Point</h3>
                <select defaultValue={form.cornerDotStyle} onChange={e => handleChange({ ...form, cornerDotStyle : e.target.value })}>
                    <option value={"square"}>Carre</option>
                    <option value={"dot"}>Arrondi</option>
                </select>
                <label>
                    <input type="checkbox" defaultChecked={form.cornerDots.gradientActive} onChange={e => handleChange({ ...form, cornerDots : {...form.cornerDots, gradientActive : e.target.checked } })} />
                    Dissocier couleur
                </label>
                {form.cornerDots.gradientActive && <GradientStops column={"cornerDots"} />}
            </Flex>
        </Flex>
    </AppContext.Provider>
}

const GradientStops = ({column}) => {
    const { form, handleChange } = useContext(AppContext);

    return <>
        <select onChange={e => handleChange({ ...form,  [column] : {...form[column], gradientType : e.target.value } })}>
            <option value={"linear"}>Linéaire</option>
            <option value={"radial"}>Radial</option>
        </select>
        <input type={"number"} min={0} max={99} maxLength={2} step={.1} onChange={e => handleChange({ ...form, [column] : {...form[column], gradientAngle : e.target.value } })} defaultValue={form.data} placeholder={"Rotation Dégradé (en %)"} />
        <Flex $direction={"column"}>
            {form[column]?.gradientStops?.map((grad, i) => {
                return <Flex key={i}>
                    <span>Couleur {i+1}</span>
                    <input
                        type={"number"}
                        defaultValue={form[column].gradientStops[i].offset}
                        step={10}
                        min={0}
                        max={100}
                        maxLength={3}
                        onChange={e => handleChange({
                            ...form,
                            [column]: {    
                                ...form[column],
                                gradientStops : Object.values({
                                    ...form[column].gradientStops,
                                    [i] : {...form[column].gradientStops[i], offset: e.target.value}
                                })
                            }
                        })}
                        placeholder={"Position couleur (en %)"}
                    />
                    <input
                        type={"color"}
                        defaultValue={form[column].gradientStops[i].color}
                        onChange={e => handleChange({
                            ...form,
                            [column] : {
                                ...form[column],
                                gradientStops : Object.values({
                                    ...form[column].gradientStops,
                                    [i] : {...form[column].gradientStops[i], color: e.target.value}
                                })
                            }
                        })}
                        placeholder={"Couleur"}
                    />
                    {i>0 && <button
                        onClick={() => {
                        handleChange({
                            ...form,
                            [column] : {
                                ...form[column],
                                gradientStops : form[column].gradientStops.filter((v, k) => k !== i)
                            }
                        })}
                        }>Supprimer</button>}
                </Flex>
            })}
        </Flex>
        <button onClick={() => {
            handleChange({
                ...form,
                [column] : {...form[column], gradientStops : [...form[column].gradientStops, {offset: 0.0, color: "#000000"}]}
            })}
        }>Ajouter couleur degradé</button>
    </>
}