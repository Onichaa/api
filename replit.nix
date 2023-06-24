{ pkgs }: {
  deps = [
    pkgs.unzip
    pkgs.nodejs
    pkgs.chromium
    pkgs.ffmpeg
    pkgs.imagemagick
    pkgs.libwebp
    pkgs.bc
    pkgs.pm2
    pkgs.bashInteractive
    pkgs.nodePackages.bash-language-server
    pkgs.man
  ];
}