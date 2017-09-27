# Importing the libraries
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, OneHotEncoder
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
import pickle as pk
import os.path
import sys
import json


def file_exists(filepath):
    return os.path.isfile(filepath)


def prepare_test():
    # Importing and formatting test dataset
    test__data = pd.read_csv('../data/test.csv')
    test__data = test__data.iloc[:, [0, 1, 3, 4, 5, 6, 8, 11]]

    test__data = test__data.dropna()
    y = test__data.iloc[:, -1].values
    x = test__data.iloc[:, 1:-1].values

    # Encoding categorical data
    le = LabelEncoder()
    x[:, 1] = le.fit_transform(x[:, 1])

    encoder = OneHotEncoder(categorical_features=[0])
    x = encoder.fit_transform(x).toarray()
    x = x[:, 1:]

    return x, y


def prepare_train():
    # Importing train datasets
    train = pd.read_csv('../data/train.csv')

    # preparing training dataset
    train = train.iloc[:, [1, 2, 4, 5, 6, 7, 9]]
    train = train.dropna()
    x = train.iloc[:, 1:].values
    y = train.iloc[:, 0].values

    # Encoding categorical data
    le = LabelEncoder()
    x[:, 1] = le.fit_transform(x[:, 1])

    encoder = OneHotEncoder(categorical_features=[0])
    x = encoder.fit_transform(x).toarray()
    x = x[:, 1:]

    return x, y


if __name__ == "__main__":
    args = sys.argv[:]
    direct = None
    op_type = None
    test = None

    if len(args) > 1:
        if args[1] == 'debug':
            op_type = 'accuracy'
            direct = ''
    if len(args) > 2:
        op_type = args[2]
        direct = args[1]
    if len(args) > 3:
        test = json.loads(args[3])

    if op_type == 'accuracy' and direct is not None:
        # make sure to scale data before training
        sc = StandardScaler()
        x_train, y_train = prepare_train()
        x_train = sc.fit_transform(x_train)
        x_test, answers = prepare_test()
        x_test = sc.fit_transform(x_test)

        if not file_exists(direct):
            # Fitting Multiple Linear Regression to the Training set
            classifier = LogisticRegression(random_state=0)
            classifier.fit(x_train, y_train)
            # print("No save file training classifier")

        else:
            classifier = pk.load(open(direct, "rb"))
            # print("Found save file loading classifier from there")

        # Predicting the Test set results
        y_pred = classifier.predict(x_test)

        # checking accuracy of predictions
        accuracy = accuracy_score(answers, y_pred)
        print(accuracy)
        sys.stdout.flush()

        # save classifier
        pk.dump(classifier, open(direct, "wb"))

    elif op_type == 'classify' and direct is not None and test is not None:
        # make sure to scale data before training
        sc = StandardScaler()
        x_train, y_train = prepare_train()
        x_train = sc.fit_transform(x_train)

        test = np.array([test])
        x_test = sc.fit_transform(test)

        if not file_exists(direct):
            # Fitting Multiple Linear Regression to the Training set
            classifier = LogisticRegression(random_state=0)
            classifier.fit(x_train, y_train)
            # print("No save file training classifier")

        else:
            classifier = pk.load(open(direct, "rb"))
            # print("Found save file loading classifier from there")

        # Predicting the Test set results
        y_pred = classifier.predict(test)

        if (y_pred[0] == 1):
            print('SURVIVED')
        else:
            print('DID NOT SURVIVE')

        sys.stdout.flush()

    else:
        print('type {0} is not supported'.format(op_type))
        sys.stdout.flush()
