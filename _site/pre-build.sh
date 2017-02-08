rm -rf categories
rm -f categorycount.json
jekyll build 
cp -r _site/categories .
cp -r _site/categorycount.json .

if [ "$1" = "test" ];then
    jekyll serve  --force_polling
fi
