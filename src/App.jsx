import { QRCodeCanvas } from '@loskir/styled-qr-code-node';
import { useState, useRef, useEffect } from 'react';

export default function App() {
    const [url, setUrl] = useState('');
    const [qrCode, setQRCode] = useState(null);
    const [form, setForm] = useState({
        data: "",
        gradientAngle: 0,
        gradientStops: [
            {color: "#ff0000", offset: 0.0}
        ]
    })

    useEffect(() => {
        handleChange(form)
    }, []);

    const handleChange = (form) => {
        const qrCode = new QRCodeCanvas({
            width: 3000, height: 3000,
            data: form.data,
            type: '',
            margin: 100,
            backgroundOptions: {
                gradient: {
                    rotation: (form.gradientAngle / 100) * (2 * Math.PI),
                    /*colorStops: [
                        { offset: 0, color: 'black' },
                    ]*/
                    colorStops: form.gradientStops.map(
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
                errorCorrectionLevel: 'Q',
            },
            imageOptions: {
                imageSize: 0.5,
                hideBackgroundDots: false,
            },
            dotsOptions: {
                type: "extra-rounded",
                color: "white",
                gradient: {
                    rotation: 0.785,
                    colorStops: [
                        { offset: 0.4, color: 'white' },
                        { offset: 1, color: 'grey' },
                    ]
                }
            },
            cornersSquareOptions: {
                type: "extra-rounded"
            },
            cornersDotOptions: {
                type: "dot"
            }
        });

        setQRCode(qrCode);
        qrCode?.toDataUrl().then(url => setUrl(url))
        setForm(form);

        console.log(form);
    }


    return <>
        <img src={url} style={{ width: 300 }} />
        <input type={"text"} onChange={e => handleChange({ ...form, data : e.target.value })} defaultValue={form.data} placeholder={"Données"} />
        <input type={"number"} min={0} max={99} maxLength={2} step={.1} onChange={e => handleChange({ ...form, gradientAngle : e.target.value })} defaultValue={form.data} placeholder={"Rotation Dégradé (en %)"} />

        {form.gradientStops.map((grad, i) => {
            return <>
                <input type={"number"} defaultValue={form.gradientStops[i].offset} step={10} min={0} max={100} maxLength={3} onChange={e => handleChange({
                    ...form,
                    gradientStops : Object.values({
                        ...form.gradientStops,
                        [i] : {...form.gradientStops[i], offset: e.target.value}
                    })
                })} placeholder={"Position couleur (en %)"} />
                <input type={"color"} defaultValue={form.gradientStops[i].color} onChange={e => handleChange({
                    ...form,
                    gradientStops : Object.values({
                        ...form.gradientStops,
                        [i] : {...form.gradientStops[i], color: e.target.value}
                    })
                })} placeholder={"Couleur"} />
                {i>0 && <button onClick={() => {
                    handleChange({
                        ...form,
                        gradientStops : form.gradientStops.filter((v, k) => k !== i)
                    })}
                }>Supprimer</button>}
            </>
        })}
        <button onClick={() => {
            handleChange({
                ...form,
                gradientStops : [...form.gradientStops, {offset: 0.0, color: "#000000"}]
            })}
        }>Ajouter couleur degradé</button>

    </>
}