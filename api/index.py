from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from transformers import pipeline,AutoProcessor,BarkModel,MusicgenForConditionalGeneration
from PyPDF2 import PdfReader
from io import BytesIO
# from waitress import serve
import textract
import scipy

app = Flask(__name__)
CORS(app, supports_credentials=True)

@app.route("/")
def Home():
    return "Home Page"

@app.route('/summarize', methods=['POST'])
def summarize():
    summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")

    # Check if the request contains a file
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    
    # Check if the file is empty
    if file.filename == '':
        return jsonify({"error": "Empty file provided"}), 400
    
    if file.filename.endswith('.pdf'):
        reader = PdfReader(file)
        content = ' '.join(page.extract_text() for page in reader.pages)
    elif file.filename.endswith('.txt'):
        content = file.read().decode('utf-8')
    
    else:
        content = textract.process(BytesIO(file.read())).decode('utf-8')

    summary = summarizer(content, max_length=130, min_length=40, do_sample=False)

    return jsonify({"summary": summary[0]['summary_text']}), 200

@app.route('/text-speech', methods=['POST'])
def text_speech():
    input = request.json['text']
    processor = AutoProcessor.from_pretrained("suno/bark-small")
    model = BarkModel.from_pretrained("suno/bark-small")

    voice_preset = "v2/en_speaker_6"
    inputs = processor(input, voice_preset=voice_preset, return_tensors="pt")
    attention_mask = inputs["attention_mask"]
    
    audio_array = model.generate(input_ids=inputs["input_ids"],attention_mask=attention_mask,pad_token_id=500)
    audio_array = audio_array.cpu().numpy().squeeze()
    sample_rate = model.generation_config.sample_rate
    
    scipy.io.wavfile.write("audio.wav", sample_rate, audio_array)
    return Response(open("audio.wav", "rb"), mimetype="audio/wav")  
    # audio_io = BytesIO()
    # scipy.io.wavfile.write(audio_io, sample_rate, audio_array)
    # audio_io.seek(0)
    # return Response(audio_io.read(), mimetype="audio/wav")  

# @app.route('/text-music', methods=['POST'])
# def text_music():
#     input = request.json['text']
#     processor = AutoProcessor.from_pretrained("facebook/musicgen-small")
#     model = MusicgenForConditionalGeneration.from_pretrained("facebook/musicgen-small")
#     inputs = processor(input, padding=True, return_tensors="pt")
#     audio_values = model.generate(**inputs, do_sample=True, max_new_tokens=256)
#     # audio_values = audio_values.cpu().numpy().squeeze()
#     # sample_rate = model.config.audio_encoder.sample_rate
#     audio_values = audio_values.cpu().numpy()
#     # sample_rate = model.generation_config.sample_rate
#     sampling_rate = model.config.audio_encoder.sampling_rate
#     scipy.io.wavfile.write("music.wav", sampling_rate, audio_values)
#     return Response(open("music.wav", "rb"), mimetype="audio/wav")

if __name__ == '__main__':
    # serve(app, host='0.0.0.0', port=5328)
    app.run()
 