import { useEffect, useState } from "react";
import {SpeechConfig, AudioConfig, SpeechSynthesizer} from 'microsoft-cognitiveservices-speech-sdk';
import axios from 'axios';
import {xmlString} from './speech.js'
import config from './config.json';

const roVoice = 'ro-RO-AlinaNeural';
const voicePrefix = 'en-US';
const voices = ['AriaNeural', 'AIGenerate1Neural', 'AIGenerate2Neural', 'AmberNeural', 'AnaNeural', 'AshleyNeural', 'DavisNeural', 'EricNeural', 'RogerNeural'];
const styles = ['chat', 'customerservice', 'narration-professional', 'newscast-casual', 'newscast-formal', 'cheerful', 'empathetic', 'angry', 'sad', 'excited', 'friendly', 'terrified', 'shouting', 'unfriendly', 'whispering', 'hopeful']

export const TextToSpeech = () => {
    const [text, setText] = useState('');
    const [busy, setBusy] = useState(false);
    const [voice, setVoice] = useState(voices[0]);
    const [style, setStyle] = useState(styles[2]);
    const [isRoVoice, setIsRoVoice] = useState(false);
    const [xml, setXml] = useState();

    const [audioData, setAudioData] = useState();
    const [url, setUrl] = useState();

    function synthesizeSpeech() {
        setBusy(true);
        const speechConfig = SpeechConfig.fromSubscription(config.speechService.key1, config.speechService.region);
        const audioConfig = AudioConfig.fromDefaultSpeakerOutput();
    
        
        // speechConfig.speechSynthesisVoiceName(setIsRoVoice ? roVoice : voicePrefix + voice);
        const synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);
        synthesizer.speakSsmlAsync(
            xml,
            result => {
                if (result) {
                    synthesizer.close();
                    setBusy(false);

                    setAudioData(result.audioData);
                    return result.audioData;
                }
            },
            error => {
                console.log(error);
                setBusy(false);
                synthesizer.close();
            });
    }

    function parseAudio() {
        // console.log('get xml:', xmlString);
        // const parser = new DOMParser()
        // const xmlParsed = parser.parseFromString(xmlString, 'text/xml');
        // console.log(xmlParsed);
        // xmlParsed.getElementsByTagName('voice')[0].setAttribute('name', isRoVoice ? roVoice : voicePrefix + '-' + voice);
        // xmlParsed.getElementsByTagName('voice')[0].setAttribute('style', style);
        // xmlParsed.getElementsByTagName('voice')[0].childNodes[0].nodeValue = text;
        // const updatedXml = new XMLSerializer().serializeToString(xmlParsed);

        const updatedXml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
        <voice name="${isRoVoice ? roVoice : voicePrefix + '-' + voice}">${text}</voice></speak>`
        console.log('parsed audio > ', updatedXml);
        setXml(updatedXml);
    }

    const saveData = () => {
        const obj = new Blob([new Uint8Array(audioData)]);
        const url = URL.createObjectURL(obj);
        console.log(obj);
        setUrl(url);
    }

    return <div>
        <textarea onChange={(e) => setText(e.target.value)} />
        <br />{isRoVoice}
        <select onChange={(e) => setVoice(e.target.value)} disabled={isRoVoice}>
            {voices.map(d => <option value={d} key={d}>{d}</option>)}
        </select>
        &nbsp;
        <select onChange={(e) => setStyle(e.target.value)}>
            {styles.map(d => <option value={d} key={d}>{d}</option>)}
        </select>
        &nbsp;
        <span><input onChange={() => setIsRoVoice(!isRoVoice)} type='checkbox' value={isRoVoice}/>Romanian Voice</span>
        <hr/>
        <div>
            <button disabled={busy || !text.length} onClick={synthesizeSpeech}>Create Audio</button>
            <br />
            {busy && <span>Loading...</span>}
        </div>
        <br />

        <button onClick={() => saveData()}  disabled={!audioData}>Download</button>
        <a href={url} download='audio-file.wav'>download</a>
        <br />
        <button onClick={() => parseAudio()}>Parse Styles</button>
    </div>
}