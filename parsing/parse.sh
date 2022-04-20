#!/bin/bash
# Parse ExpoSE Output files

TMP_FILE=$(mktemp)
SUCCESS_FILE="./test_cases.txt"
FAILURE_FILE="./error_cases.txt"


# Check command line parameters
if (( $# < 1 )); then
	echo "E: Missing File"
	exit 1
fi

# Clear previous files
if [ -e $SUCCESS_FILE ]; then
	echo "W: Overwriting $SUCCESS_FILE"
	rm $SUCCESS_FILE
fi
if [ -e $FAILURE_FILE ]; then
	echo "W: Overwriting $FAILURE_FILE"
	rm $FAILURE_FILE
fi


# Populate test case success file
sed '/^\[+] {/!d' $1 > $SUCCESS_FILE

# Populate errors file
sed  '/^\[!].*$/!s/.*//' $1 > $TMP_FILE
sed -i '/^\[!] Done$/d' $TMP_FILE
sed -i '/^\[!] Stats$/d' $TMP_FILE

state=0
while read l; do
	if [[ $l == "" ]]; then
		# Ignore repeating blank lines
		if [[ $state == 1 ]]; then
			echo "" >> $FAILURE_FILE
		fi
		state=0
	else
		echo "$l" >> $FAILURE_FILE
		state=1
	fi
done < $TMP_FILE
