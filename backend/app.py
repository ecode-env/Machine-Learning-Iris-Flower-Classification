from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

app = Flask(__name__)
CORS(app)

# Load your saved KNN model
with open('../The Classic Iris Data Set/knn_model.pkl', 'rb') as f:
    model = pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    features = data.get('features')

    if not features or len(features) != 4:
        return jsonify({'error': 'Please provide 4 feature values'}), 400

    features_np = np.array(features).reshape(1, -1)

    # Get predicted label and probabilities
    pred = model.predict(features_np)[0]
    proba = model.predict_proba(features_np)[0]  # array like [0.1, 0.8, 0.1]

    confidence = round(np.max(proba) * 100, 2)  # highest probability as percentage

    return jsonify({
        'species': pred,
        'confidence': confidence  # like 80.0
    })


if __name__ == '__main__':
    app.run(debug=True)
