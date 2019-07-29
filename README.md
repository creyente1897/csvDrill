# CSV Drill

### CSV Drill is a CLI Tool for Performing SQL Query Execution on CSV Files

*NOTE: All commands and files should be lowercase and all the commands will be performed in lowercase*

### Documentation

Please click [here](https://github.com/creyente1897/csvDrill/blob/master/DOCUMENTATION.md) for documentation.

## Prerequisites

- NodeJS 
- Npm
- Oclif
- Chalk
- Cli UX
- CSV Parser
- Basic SQL Query Knowledge 

## Local Installation

Clone the project

```sh
git clone https://github.com/creyente1897/csvDrill.git
cd csvDrill
```

Installing node modules (dependencies)

```sh
npm install
```

Running the project (In terminal)

```sh
./bin/run csvdrill --dbpath="path/to/directory"
./bin/run csvdrill -d="path/to/directory"
```

OR

```sh
./bin/run csvdrill --dbpath="path/to/file"
./bin/run csvdrill -d="path/to/file"
```

*FOR HELP*

```sh
./bin/run csvdrill --help"
```

## Testing the app

*Note: Please update the directory/file path before proceeding*

```sh
npm test
```