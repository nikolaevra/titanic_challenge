# Data Preprocessing Template

# Importing the libraries
from sklearn.linear_model import LinearRegression
import statsmodels.formula.api as sm
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from sklearn.preprocessing import LabelEncoder, OneHotEncoder

# Importing datasets
dataset = pd.read_csv('train.csv')
test = pd.read_csv('test.csv')

# preparing training dataset
X_train = dataset.iloc[2:].values
# X = X.reshape(-1, 1)
y_train = dataset.iloc[:, 1].values

# Encoding categorical data
labelencoder = LabelEncoder()
X_train[:, 3] = labelencoder.fit_transform(X_train[:, 3])
onehotencoder = OneHotEncoder(categorical_features=[3])
X = onehotencoder.fit_transform(X_train).toarray()
# Avoiding the Dummy Variable Trap
X = X[:, 1:]

# preparing test dataset
X_test = dataset.iloc[2:].values
# X = X.reshape(-1, 1)
y_test = dataset.iloc[:, 1].values


# Fitting Multiple Linear Regression to the Training set
regressor = LinearRegression()
regressor.fit(X_train, y_train)

# Predicting the Test set results
y_pred = regressor.predict(X_test)
print(y_pred)


"""
X = np.append(arr=np.ones((50, 1)).astype(int), values=X, axis=1)
X_opt = X[:, [0, 1, 2, 3, 4, 5]]
regressor_OLS = sm.OLS(endog=y, exog=X_opt).fit()
regressor_OLS.summary()
"""