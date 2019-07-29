# CSV Drill

### CSV Drill is a CLI Tool for Performing SQL Query Execution on CSV Files

*NOTE: All commands and files should be lowercase and all the commands will be performed in lowercase*

*NOTE: All commands should be written exactly similar to the commands provided in this documentation*

#### The following documentation will guide you through the SQL statements that can be performed with CSV Drill

## SQL Queries

### CREATE TABLE

The following query will create a csv file with provided column names *mind the spaces*

```
>: CREATE TABLE file.csv column1,column2,column3,column4 ;
```

### INSERT

The following query will insert the values in the csv file *mind the spaces*

```
>: INSERT INTO file.csv column1,column2 VALUES one,three,null,null ;
```
*Please put null for a column coming in between -*
*For Example:*
*INSERT INTO file.csv column1,column3 VALUES one,null,three,null ;*

### DROP

The following query will delete the csv file

```
>: DROP TABLE file.csv;
```

### DELETE

The following query will delete the values from a csv file *mind the spaces*

```
>: DELETE FROM file.csv WHERE column1=one&column2=three ;
```

### UPDATE

The following query will update the values in a csv file *mind the spaces*

```
>: UPDATE file.csv SET column1=seven where column2=three ;
```
```
>: UPDATE file.csv SET column1=seven&column3=one where column2=three&column4=six ;
```

### SELECT

The following query(s) will perform the following operations *mind the spaces*

- Select everything from a file

```
>: SELECT * FROM file.csv ;
```

- Select particular column(s) from a file

```
>: SELECT column1,column2 FROM file.csv;
```

- Select all or particular columns from a file with a where attribute

```
>: SELECT * FROM file.csv WHERE column1=one ;
```
```
>: SELECT column3,column4 FROM file.csv WHERE column1=one ;
```

- Select all columns from a file with a limit attribute

```
>: SELECT * FROM file.csv LIMIT=5 ;
```
```
>: SELECT * FROM file.csv LIMIT=5 OFFSET=2 ;
```

- Select particular columns from a file with a limit attribute

```
>: SELECT column1,column2 FROM file.csv LIMIT=5 ;
```
```
>: SELECT column1,column2 FROM file.csv LIMIT=5 OFFSET=2 ;
```

- Select all columns from a file with an order by attribute

```
>: SELECT * FROM file.csv ORDER BY column1 ;
```
```
>: SELECT * FROM file.csv ORDER BY column1 DESC ;
```

- Select particular columns from a file with an order by attribute

```
>: SELECT column1,column2 FROM file.csv ORDER BY column1 ;
```
```
>: SELECT column1,column2 FROM file.csv ORDER BY column1 DESC ;
```

- Select particular values after joinin two tables

*Only for joining two tables*

```
>: SELECT column1 AS user, column1 AS favorite FROM file1.csv JOIN file2.csv ON favorite_column=id_column ;
```

Currently these queries work with CSV Drill.