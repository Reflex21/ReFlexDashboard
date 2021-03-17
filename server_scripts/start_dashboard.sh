#!/bin/bash
set -e

#run command as sudo if not in sudo mode 
if [ "$(id -u)" -ne 0 ]
then
	exec sudo bash  "${0}" "${@}"
fi


chmod +x start_back_end.sh 
chmod +x start_frontend.sh

screen -d -m -t w_one sh start_back_end.sh
screen -d -m -t w_two sh start_frontend.sh




