> [!NOTE]
> To test the API, you can use the following link:
[example](http://localhost:9000/users?limit=20&page=0&sort_by=+name,-id&filter_by=age>20|age<30,name=John&fields=name,age "link")


### For pagination section:
- use limit for number of items per page (default is 1000)
- use page for page number (start from 0)

```
limit=20&page=0
```

### For Sort section:
- use + for ascending order
- use - for descending order

```
sort_by=+name,-id
```

### For Filter section:
- use | for OR 
- use , for AND

```
filter_by=age>20|age<30,name=John
```

## For select fields section:
- use , for multiple fields

```
fields=name,age
```