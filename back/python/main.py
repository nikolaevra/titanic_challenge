# Importing the libraries
import pandas as pd
from sklearn.preprocessing import LabelEncoder, OneHotEncoder
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
import pickle as pk
import os.path
import sys


def file_exists():
    dir_path = os.path.dirname(os.path.realpath(__file__))
    filepath = dir_path + "/save.p"
    return os.path.isfile(filepath)


def prepare_test():
    # Importing and formatting test dataset
    test = pd.read_csv('../data/test.csv')
    test = test.iloc[:, [0, 1, 3, 4, 5, 6, 8, 11]]

    test = test.dropna()
    y = test.iloc[:, -1].values
    x = test.iloc[:, 1:-1].values

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
    # make sure to scale data before training
    sc = StandardScaler()
    x_train, y_train = prepare_train()
    x_train = sc.fit_transform(x_train)
    x_test, answers = prepare_test()
    x_test = sc.fit_transform(x_test)

    if not file_exists():
        # Fitting Multiple Linear Regression to the Training set
        classifier = LogisticRegression(random_state=0)
        classifier.fit(x_train, y_train)
        print("No save file training classifier")

    else:
        classifier = pk.load(open("save.p", "rb"))
        print("Found save file loading classifier from there")

    # Predicting the Test set results
    y_pred = classifier.predict(x_test)

    # checking accuracy of predictions
    accuracy = accuracy_score(answers, y_pred)
    print(accuracy)
    sys.stdout.flush()

    # save classifier
    pk.dump(classifier, open("save.p", "wb"))
