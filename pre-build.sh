rm -rf categories
jekyll build 
cp -r _site/categories .

if [ "$1" = "test" ];then
    jekyll serve  --force_polling
fi
