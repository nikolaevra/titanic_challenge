# Data Preprocessing Template

# Importing the libraries
from sklearn.linear_model import LinearRegression
import statsmodels.formula.api as sm
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from sklearn.preprocessing import LabelEncoder, OneHotEncoder

# Importing datasets
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

# Fitting Multiple Linear Regression to the Training set
regressor = LinearRegression()
regressor.fit(X_train, y_train)

# Comparing to the test set
test = pd.read_csv('test.csv')

test = test.iloc[:, [0, 1, 3, 4, 5, 6, 8]]
test = test.dropna()
ids = test.iloc[:, 0].values
X_test = test.iloc[:, 1:].values

# Encoding categorical data
labelencoder = LabelEncoder()
X_test[:, 1] = labelencoder.fit_transform(X_test[:, 1])

onehotencoder = OneHotEncoder(categorical_features=[0])
X_test = onehotencoder.fit_transform(X_test).toarray()
X_test = X_test[:, 1:]

# Predicting the Test set results
y_pred = regressor.predict(X_test)

answers = pd.read_csv('gender_submission.csv')
ans = answers.iloc[:, :].values
ans_mat = np.hstack((np.transpose([ids]), np.transpose([y_pred])))


X = np.append(arr=np.ones((714, 1)).astype(int), values=X_train, axis=1)
X_opt = X[:, [0, 1, 2, 3, 4, 5, 6]]
regressor_OLS = sm.OLS(endog=y_train, exog=X_opt).fit()
regressor_OLS.summary()
X = np.append(arr=np.ones((714, 1)).astype(int), values=X_train, axis=1)
X_opt = X[:, [0, 1, 2, 3, 4, 5]]
regressor_OLS = sm.OLS(endog=y_train, exog=X_opt).fit()
regressor_OLS.summary()
