import React, { useState, useEffect } from 'react';
import { Flower, Brain, Loader2, AlertCircle, CheckCircle, Wifi, WifiOff } from 'lucide-react';
import { predictSpecies } from './services/api.js';

function App() {
  const [features, setFeatures] = useState({
    sepalLength: 5.0,
    sepalWidth: 3.5,
    petalLength: 4.0,
    petalWidth: 1.5,
  });
  
  const [prediction, setPrediction] = useState('');
  const [confidence, setConfidence] = useState(0)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState(null);

  const featureConfigs = [
    {
      key: 'sepalLength',
      label: 'Sepal Length',
      min: 3.0,
      max: 8.0,
      step: 0.1,
      unit: 'cm',
      color: 'from-emerald-400 to-teal-500',
      description: 'Length of the outer floral leaf'
    },
    {
      key: 'sepalWidth',
      label: 'Sepal Width',
      min: 1.5,
      max: 5.0,
      step: 0.1,
      unit: 'cm',
      color: 'from-blue-400 to-indigo-500',
      description: 'Width of the outer floral leaf'
    },
    {
      key: 'petalLength',
      label: 'Petal Length',
      min: 1.0,
      max: 7.0,
      step: 0.1,
      unit: 'cm',
      color: 'from-purple-400 to-pink-500',
      description: 'Length of the inner floral leaf'
    },
    {
      key: 'petalWidth',
      label: 'Petal Width',
      min: 0.1,
      max: 3.0,
      step: 0.1,
      unit: 'cm',
      color: 'from-orange-400 to-red-500',
      description: 'Width of the inner floral leaf'
    }
  ];

  const makePrediction = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const featuresArray = [
        features.sepalLength,
        features.sepalWidth,
        features.petalLength,
        features.petalWidth
      ];
      
      const species = await predictSpecies(featuresArray);
      setPrediction(species.species);
      setConfidence(species.confidence)
      setIsConnected(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setPrediction('');
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeatureChange = (key, value) => {
    setFeatures(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getSpeciesInfo = (species) => {
    const speciesMap = {
      'setosa': {
        name: 'Iris Setosa',
        description: 'Known for its small petals and robust sepals. Native to Alaska, Canada, and the northern United States.',
        color: 'text-emerald-600',
        characteristics: ['Small petals', 'Wide sepals', 'Hardy species', 'Cold climate adapted']
      },
      'versicolor': {
        name: 'Iris Versicolor',
        description: 'Features medium-sized petals with moderate proportions. Also known as the Blue Flag iris.',
        color: 'text-blue-600',
        characteristics: ['Medium petals', 'Balanced proportions', 'Purple-blue flowers', 'Wetland species']
      },
      'virginica': {
        name: 'Iris Virginica',
        description: 'Distinguished by large petals and elongated features. The largest of the three iris species.',
        color: 'text-purple-600',
        characteristics: ['Large petals', 'Long sepals', 'Tall growth', 'Late blooming']
      }
    };
    
    return speciesMap[species.toLowerCase()] || { 
      name: species, 
      description: 'Unknown species',
      color: 'text-gray-600',
      characteristics: []
    };
  };

  // // Real-time prediction with debounce
  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     makePrediction();
  //   }, 800);
  //
  //   return () => clearTimeout(timeoutId);
  // }, [features]);

  const speciesInfo = prediction ? getSpeciesInfo(prediction) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-3 rounded-full shadow-lg">
              <Flower className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Iris Species Predictor
          </h1>
          <p className="text-gray-600 text-lg mb-4">
            Adjust the flower measurements below to predict the iris species using machine learning
          </p>
          
          {/* Connection Status */}
          <div className="flex items-center justify-center space-x-2">
            {isConnected === true && (
              <div className="flex items-center text-green-600 text-sm">
                <Wifi className="w-4 h-4 mr-1" />
                Connected to Flask API
              </div>
            )}
            {isConnected === false && (
              <div className="flex items-center text-red-600 text-sm">
                <WifiOff className="w-4 h-4 mr-1" />
                Disconnected from Flask API
              </div>
            )}
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Input Controls */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <Brain className="w-6 h-6 text-indigo-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-800">
                Flower Measurements
              </h2>
            </div>

            <div className="space-y-8">
              {featureConfigs.map((config) => (
                <div key={config.key} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <label htmlFor={config.key} className="text-sm font-medium text-gray-700">
                        {config.label}
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        {config.description}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded-full">
                      {features[config.key]} {config.unit}
                    </span>
                  </div>
                  
                  <div className="relative">
                    <input
                      id={config.key}
                      type="range"
                      min={config.min}
                      max={config.max}
                      step={config.step}
                      value={features[config.key]}
                      onChange={(e) => handleFeatureChange(config.key, parseFloat(e.target.value))}
                      className={`slider w-full h-3 rounded-lg appearance-none cursor-pointer bg-gradient-to-r ${config.color} shadow-md`}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{config.min}</span>
                      <span>{config.max}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={makePrediction}
              disabled={isLoading}
              className="w-full mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Analyzing with KNN Model...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Brain className="w-5 h-5 mr-2" />
                  Predict Species Now
                </div>
              )}
            </button>
          </div>

          {/* Results */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <Flower className="w-6 h-6 text-emerald-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-800">
                Prediction Result
              </h2>
            </div>

            {error ? (
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-red-800">Connection Error</h3>
                    <p className="text-red-600 text-sm mt-1">{error}</p>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <h4 className="font-medium text-blue-800 mb-2">Troubleshooting Steps:</h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Ensure your Flask server is running on port 5000</li>
                    <li>• Check that CORS is enabled in your Flask app</li>
                    <li>• Verify the KNN model file (knn_model.pkl) exists</li>
                    <li>• Run: <code className="bg-blue-100 px-1 rounded">python app.py</code></li>
                  </ul>
                </div>
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mx-auto mb-4" />
                  <p className="text-gray-600">Analyzing measurements with KNN algorithm...</p>
                  <p className="text-gray-500 text-sm mt-2">Processing {Object.values(features).join(', ')} cm</p>
                </div>
              </div>
            ) : speciesInfo ? (
              <div className="space-y-6">
                <div className="flex items-start space-x-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-green-800">Prediction Complete</h3>
                    <p className="text-green-600 text-sm mt-1">Species classified using KNN algorithm</p>
                  </div>
                </div>

                <div className="text-center p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <Flower className="w-10 h-10 text-white" />
                  </div>
                  <h3 className={`text-2xl font-bold mb-2 ${speciesInfo.color}`}>
                    {speciesInfo.name} {confidence}%
                  </h3>
                  <p className="text-gray-600 text-sm mb-6">
                    {speciesInfo.description}
                  </p>
                  
                  {/* Characteristics */}
                  {speciesInfo.characteristics.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-700 mb-3">Key Characteristics</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {speciesInfo.characteristics.map((char, index) => (
                          <div key={index} className="bg-white p-2 rounded-lg shadow-sm text-xs text-gray-600">
                            {char}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Measurements */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="font-medium text-gray-700">Sepal</div>
                      <div className="text-gray-600">
                        {features.sepalLength} × {features.sepalWidth} cm
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="font-medium text-gray-700">Petal</div>
                      <div className="text-gray-600">
                        {features.petalLength} × {features.petalWidth} cm
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Flower className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>Adjust the measurements to see the prediction</p>
                <p className="text-sm mt-2">Real-time predictions powered by your KNN model</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Powered by Machine Learning • KNN Classification Model • Flask + React + Axios</p>
        </div>
      </div>
    </div>
  );
}

export default App;