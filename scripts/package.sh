set -e
VERSION=$(jq -r ".version" package.json)
PACKAGE=matrixto-$VERSION.tar.gz
pnpm build
pushd build
tar -czvf ../$PACKAGE ./
popd
echo $PACKAGE
