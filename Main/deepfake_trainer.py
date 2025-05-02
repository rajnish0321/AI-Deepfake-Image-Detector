
# DeepFake Detection Model Trainer
# This script trains a model to detect AI-generated deepfake images
# Optimized for 90%+ accuracy

import os
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models, applications
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import matplotlib.pyplot as plt
from sklearn.metrics import classification_report, confusion_matrix
import seaborn as sns
import tensorflowjs as tfjs

# Set memory growth for GPU
physical_devices = tf.config.list_physical_devices('GPU')
if physical_devices:
    try:
        for device in physical_devices:
            tf.config.experimental.set_memory_growth(device, True)
    except:
        print("Memory growth setting failed")

def create_model(input_shape=(224, 224, 3), trainable_base=False):
    """Create an enhanced deepfake detection model based on EfficientNetB3"""
    
    # Use EfficientNetB3 as base model (better performance than B0)
    base_model = applications.EfficientNetB3(
        weights='imagenet', 
        include_top=False, 
        input_shape=input_shape
    )
    
    # Set base model trainability
    base_model.trainable = trainable_base
    
    # Create new model on top with advanced architecture
    model = models.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.BatchNormalization(),
        layers.Dropout(0.4),
        layers.Dense(1024, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.5),
        layers.Dense(512, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.3),
        layers.Dense(1, activation='sigmoid')  # Binary classification (real vs fake)
    ])
    
    return model

def create_data_generators(train_dir, validation_dir, test_dir, batch_size=16, img_size=(224, 224)):
    """Create enhanced data generators with augmentation"""
    
    # Strong data augmentation for training to prevent overfitting
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=30,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.3,
        horizontal_flip=True,
        vertical_flip=False,
        brightness_range=[0.7, 1.3],
        fill_mode='nearest'
    )
    
    # Only rescaling for validation and testing
    valid_test_datagen = ImageDataGenerator(rescale=1./255)
    
    # Flow training images in batches
    train_generator = train_datagen.flow_from_directory(
        train_dir,
        target_size=img_size,
        batch_size=batch_size,
        class_mode='binary',
        shuffle=True
    )
    
    # Flow validation images
    validation_generator = valid_test_datagen.flow_from_directory(
        validation_dir,
        target_size=img_size,
        batch_size=batch_size,
        class_mode='binary',
        shuffle=False
    )
    
    # Flow test images
    test_generator = valid_test_datagen.flow_from_directory(
        test_dir,
        target_size=img_size,
        batch_size=batch_size,
        class_mode='binary',
        shuffle=False
    )
    
    return train_generator, validation_generator, test_generator

def train_model(train_dir, validation_dir, test_dir, epochs=50, batch_size=16, img_size=(224, 224)):
    """Train the deepfake detection model with advanced techniques"""
    
    # Create data generators
    train_generator, validation_generator, test_generator = create_data_generators(
        train_dir, validation_dir, test_dir, batch_size, img_size
    )
    
    # Create model
    model = create_model(input_shape=(*img_size, 3))
    
    # Compile model with better optimizer
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.0001),
        loss='binary_crossentropy',
        metrics=['accuracy', tf.keras.metrics.AUC(), tf.keras.metrics.Precision(), tf.keras.metrics.Recall()]
    )
    
    # Set up callbacks for better training
    callbacks = [
        ModelCheckpoint(
            'deepfake_detector_checkpoint.h5',
            monitor='val_accuracy',
            save_best_only=True,
            mode='max',
            verbose=1
        ),
        EarlyStopping(
            monitor='val_loss',
            patience=7,
            restore_best_weights=True,
            verbose=1
        ),
        ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=3,
            min_lr=1e-6,
            verbose=1
        )
    ]
    
    # Train initial phase (frozen base model)
    print("Phase 1: Training with frozen base model...")
    history1 = model.fit(
        train_generator,
        steps_per_epoch=train_generator.samples // batch_size,
        epochs=10,
        validation_data=validation_generator,
        validation_steps=validation_generator.samples // batch_size,
        callbacks=callbacks
    )
    
    # Fine-tuning phase - unfreeze the base model
    print("Phase 2: Fine-tuning the model...")
    for layer in model.layers[0].layers[-30:]:  # Unfreeze last 30 layers of the base model
        layer.trainable = True
    
    # Recompile with lower learning rate for fine-tuning
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-5),
        loss='binary_crossentropy',
        metrics=['accuracy', tf.keras.metrics.AUC(), tf.keras.metrics.Precision(), tf.keras.metrics.Recall()]
    )
    
    # Train fine-tuning phase
    history2 = model.fit(
        train_generator,
        steps_per_epoch=train_generator.samples // batch_size,
        epochs=epochs-10,
        validation_data=validation_generator,
        validation_steps=validation_generator.samples // batch_size,
        callbacks=callbacks,
        initial_epoch=len(history1.history['loss'])
    )
    
    # Combine histories
    history = {}
    for k in history1.history.keys():
        history[k] = history1.history[k] + history2.history[k]
    
    # Save the final model
    model.save('deepfake_detector_model.h5')
    
    # Convert to TensorFlow.js format
    tfjs_output_dir = 'models/deepfake_detector_model'
    os.makedirs(tfjs_output_dir, exist_ok=True)
    tfjs.converters.save_keras_model(model, tfjs_output_dir)
    print(f"Model converted to TensorFlow.js format and saved to {tfjs_output_dir}")
    
    # Evaluate the model on test data
    print("\nEvaluating model on test data...")
    evaluate_model(model, test_generator)
    
    # Plot training history
    plot_training_history(history)
    
    return model, history

def evaluate_model(model, test_generator):
    """Evaluate the model and generate detailed metrics"""
    
    # Get predictions for test data
    test_generator.reset()
    predictions = model.predict(test_generator, steps=np.ceil(test_generator.samples / test_generator.batch_size))
    predicted_classes = (predictions > 0.5).astype('int32')
    
    # Get true labels
    true_classes = test_generator.classes
    
    # Generate classification report
    class_labels = list(test_generator.class_indices.keys())
    print("\nClassification Report:")
    print(classification_report(true_classes, predicted_classes, target_names=class_labels))
    
    # Generate confusion matrix
    cm = confusion_matrix(true_classes, predicted_classes)
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=class_labels, yticklabels=class_labels)
    plt.title('Confusion Matrix')
    plt.ylabel('True Label')
    plt.xlabel('Predicted Label')
    plt.savefig('confusion_matrix.png')
    
    # Calculate overall accuracy
    accuracy = (cm[0, 0] + cm[1, 1]) / np.sum(cm)
    print(f"\nOverall Accuracy: {accuracy * 100:.2f}%")
    
    # Calculate metrics
    results = model.evaluate(test_generator)
    metrics = dict(zip(model.metrics_names, results))
    
    print(f"Test Loss: {metrics['loss']:.4f}")
    print(f"Test Accuracy: {metrics['accuracy']:.4f}")
    print(f"Test AUC: {metrics['auc']:.4f}")
    print(f"Test Precision: {metrics['precision']:.4f}")
    print(f"Test Recall: {metrics['recall']:.4f}")

def plot_training_history(history):
    """Plot training & validation accuracy and loss"""
    
    # Create figure with 2 subplots
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 5))
    
    # Plot accuracy
    ax1.plot(history['accuracy'])
    ax1.plot(history['val_accuracy'])
    ax1.set_title('Model Accuracy')
    ax1.set_ylabel('Accuracy')
    ax1.set_xlabel('Epoch')
    ax1.legend(['Train', 'Validation'], loc='lower right')
    ax1.grid(True)
    
    # Plot loss
    ax2.plot(history['loss'])
    ax2.plot(history['val_loss'])
    ax2.set_title('Model Loss')
    ax2.set_ylabel('Loss')
    ax2.set_xlabel('Epoch')
    ax2.legend(['Train', 'Validation'], loc='upper right')
    ax2.grid(True)
    
    # Save the figure
    plt.tight_layout()
    plt.savefig('training_history.png')

def prepare_data_guidelines():
    """Print guidelines for dataset preparation"""
    print("DeepFake Detection Model Trainer (High Accuracy Version)")
    print("======================================================")
    print("\nThis script requires a well-balanced dataset with the following structure:")
    print("dataset/")
    print("├── train/")
    print("│   ├── real/     (at least 10,000 authentic images)")
    print("│   └── fake/     (at least 10,000 deepfake images)")
    print("├── validation/")
    print("│   ├── real/     (at least 2,000 authentic images)")
    print("│   └── fake/     (at least 2,000 deepfake images)")
    print("└── test/")
    print("    ├── real/     (at least 2,000 authentic images)")
    print("    └── fake/     (at least 2,000 deepfake images)")
    
    print("\nFor best results:")
    print("1. Include a diverse range of images")
    print("2. Ensure balanced distribution of different types of deepfakes")
    print("3. Include images from various sources (different cameras, lighting conditions, etc.)")
    print("4. Make sure fake and real images have similar characteristics")
    print("5. Ensure your images are properly cleaned and preprocessed")

if __name__ == "__main__":
    prepare_data_guidelines()
    
    # Set your dataset paths here
    train_dir = "dataset/train"
    validation_dir = "dataset/validation"
    test_dir = "dataset/test"
    
    # Check if directories exist
    if not os.path.exists(train_dir) or not os.path.exists(validation_dir):
        print("\nERROR: Dataset directories not found!")
        print("Please prepare your dataset as described above and try again.")
        exit(1)
    
    # Set parameters
    batch_size = 16  # Smaller batch size for better generalization
    img_size = (224, 224)  # Standard size for EfficientNet
    epochs = 50  # More epochs for better training
    
    print("\nStarting training process...")
    print(f"Training with {batch_size} batch size, {img_size} image size, and up to {epochs} epochs")
    
    model, history = train_model(
        train_dir, 
        validation_dir, 
        test_dir, 
        epochs=epochs,
        batch_size=batch_size,
        img_size=img_size
    )
    
    print("\nTraining complete! Model saved as 'deepfake_detector_model.h5'")
    print("\nTo use this model in the web application:")
    print("1. The model has been automatically converted to TensorFlow.js format")
    print("2. Copy the 'models/deepfake_detector_model' directory to your web app's public folder")
    print("3. The web application is already configured to use this model")

