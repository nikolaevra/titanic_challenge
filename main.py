# Data Preprocessing Template

# Importing the libraries
from sklearn.linear_model import LinearRegression
import statsmodels.formula.api as sm
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from sklearn.preprocessing import LabelEncoder, OneHotEncoder
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
import pickle as pk

# Importing train datasets
train = pd.read_csv('train.csv')

# preparing training dataset
train = train.iloc[:, [1, 2, 4, 5, 6, 7, 9]]
train = train.dropna()
X_train = train.iloc[:, 1:].values
y_train = train.iloc[:, 0].values

# Encoding categorical data
labelencoder = LabelEncoder()
X_train[:, 1] = labelencoder.fit_transform(X_train[:, 1])

onehotencoder = OneHotEncoder(categorical_features=[0])
X_train = onehotencoder.fit_transform(X_train).toarray()
X_train = X_train[:, 1:]

# Importing and formatting test dataset
test = pd.read_csv('test.csv')
test = test.iloc[:, [0, 1, 3, 4, 5, 6, 8, 11]]

test = test.dropna()
answers = test.iloc[:, -1].values
X_test = test.iloc[:, 1:-1].values

# Encoding categorical data
labelencoder = LabelEncoder()
X_test[:, 1] = labelencoder.fit_transform(X_test[:, 1])

onehotencoder = OneHotEncoder(categorical_features=[0])
X_test = onehotencoder.fit_transform(X_test).toarray()
X_test = X_test[:, 1:]

# need to scale data before we start fitting it
sc = StandardScaler()
X_train = sc.fit_transform(X_train)
X_test = sc.transform(X_test)

# Fitting Multiple Linear Regression to the Training set
classifier = LogisticRegression(random_state=0)
classifier.fit(X_train, y_train)

# Predicting the Test set results
y_pred = classifier.predict(X_test)

accuracy = accuracy_score(answers, y_pred)

pk.dump(classifier, open("save.p", "rb"))

retrained = pickle.load( open( "save.p", "rb" ) )
