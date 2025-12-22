package web

import (
	"embed"
	"io/fs"
)

//go:embed dist/*
var distFS embed.FS

// Prefix is the directory prefix for embedded files
var Prefix = "dist"

// FS returns the embedded filesystem for the dist directory
func FS() fs.FS {
	subFS, _ := fs.Sub(distFS, Prefix)
	return subFS
}

// Asset returns the content of an embedded file by name
func Asset(name string) ([]byte, error) {
	return distFS.ReadFile(Prefix + "/" + name)
}

// AssetDir returns the list of files in a directory
func AssetDir(name string) ([]string, error) {
	path := Prefix
	if name != "" && name != "." {
		path = Prefix + "/" + name
	}
	entries, err := distFS.ReadDir(path)
	if err != nil {
		return nil, err
	}
	names := make([]string, 0, len(entries))
	for _, entry := range entries {
		names = append(names, entry.Name())
	}
	return names, nil
}

// MustAsset returns the content of an embedded file or panics
func MustAsset(name string) []byte {
	data, err := Asset(name)
	if err != nil {
		panic(err)
	}
	return data
}
